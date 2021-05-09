import { Command, flags } from "@oclif/command";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as inquirer from "inquirer";
import cli from "cli-ux";
import { homedir } from "os";
import * as path from "path";
import * as fs from "fs";
import * as md5File from "md5-file";

const fileSize = require("filesize");

const SplitFile = require("split-file");
// eslint-disable-next-line node/no-extraneous-require
const mkdirp = require("mkdirp");
const cliProgress = require("cli-progress");

export default class Download extends Command {
  static description = "Download a specific file from FileShard.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ fileshard download -n MyZipFile.zip"];

  async run() {
    this.parse(Download);

    try {
      cli.action.start("Requesting File list...");
      const [fileList] = await Promise.all([
        axios.get("http://localhost:3000/api/file"),
      ]);

      if (fileList.data.rows.length === 0) {
        return this.error(
          "You have not uploaded any files yet. Use upload command to upload files to FileShard."
        );
      }

      const choiceList = fileList.data.rows.map((file: FileDoc) => {
        return {
          name: `${file.originalName} (size: ${fileSize(file.size, {
            round: 1,
          })})`,
          value: file._id,
          short: file.originalName,
        };
      });

      cli.action.stop();

      const response = await inquirer.prompt([
        {
          name: "file",
          message: "Which file do you want to download?",
          type: "list",
          choices: choiceList,
        },
      ]);

      const fileId: string = response.file;
      const fileDoc = fileList.data.rows.find(
        (file: FileDoc) => file._id === fileId
      ) as FileDoc;

      cli.action.start("Requesting the selected file from the server");

      const chunkResponse: AxiosResponse<{
        chunks: string[];
      }> = await axios.get(`http://localhost:3000/api/file/download/prepare`, {
        params: { id: fileId },
      });

      cli.action.stop();

      const multiBar = new cliProgress.MultiBar(
        {
          stopOnComplete: true,
          hideCursor: true,
          format:
            "Downloading {chunkName}: [{bar}] {percentage}% | ETA: {eta}s",
        },
        cliProgress.Presets.shades_grey
      );

      const promises = [];

      const chunkLocation = path.join(homedir(), "FileShard", "temp");
      mkdirp.sync(chunkLocation);

      const chunkList = chunkResponse.data.chunks;

      for (const chunk of chunkList) {
        const params = new URLSearchParams();
        params.append("filename", chunk);

        promises.push(
          axios
            .get("http://localhost:3000/api/file/download", {
              responseType: "stream",
              params: params,
            })
            .then(({ data, headers }) => {
              return new Promise((resolve, reject) => {
                const totalLength = headers["content-length"];
                const progressBar = multiBar.create(
                  parseInt(totalLength, 10),
                  0,
                  {
                    chunkName: path.parse(chunk).base,
                  }
                );

                const chunkPath = path.join(
                  chunkLocation,
                  path.parse(chunk).base
                );

                const writer = fs.createWriteStream(chunkPath);

                data.on("data", (chunk: any) => {
                  progressBar.increment(chunk.length);
                });

                data.on("error", (error: AxiosError) => reject(error));

                writer.on("error", (error) => reject(error));

                writer.on("finish", () => {
                  resolve(chunkPath);
                });

                data.pipe(writer);
              });
            })
        );
      }

      const promiseResponses = await Promise.allSettled(promises);

      multiBar.stop();

      const partPaths = promiseResponses.map((promises) =>
        promises.status === "fulfilled" ? promises.value : ""
      );

      cli.action.start("Assembling parts into the original file");

      SplitFile.mergeFiles(
        partPaths.sort(),
        path.join(homedir(), "FileShard", fileDoc.originalName)
      ).then(() => {
        cli.action.stop("Assembled!");
        cli.action.start("Validating assembled file integrity");

        md5File(
          path.join(homedir(), "FileShard", fileDoc.originalName)
        ).then((newMd5) =>
          newMd5 === fileDoc.md5sum
            ? cli.action.stop("Validated!")
            : this.error("Assembled file integrity validation failed!")
        );
      });
    } catch (error) {
      this.error(error);
    }
  }
}
