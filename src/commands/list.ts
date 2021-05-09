import { Command, flags } from "@oclif/command";
import axios, { AxiosResponse } from "axios";
import date = require("date-and-time");
import fileSize = require("filesize");
import Table = require("cli-table");

export default class List extends Command {
  static description = "List uploaded files to the FileShard.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ fileshard list"];

  async run() {
    this.parse(List);

    try {
      const fileList: AxiosResponse<FileListResponse> = await axios.get(
        "http://localhost:3000/api/file"
      );

      this.log("✅ File list received...");

      const numberOfFiles = fileList.data.rows.length;

      if (!(numberOfFiles > 0)) {
        return this.log(
          "You have not uploaded any files to FileShard yet. Use upload command to upload files to the server."
        );
      }

      this.log(
        `📝 Found ${numberOfFiles} ${numberOfFiles > 1 ? "files." : "file."}`
      );

      const fileTable = new Table({
        head: ["Filename", "File Type", "Size", "Uploaded On"],
        colWidths: [25, 20, 20, 25],
        style: {
          head: ["blue"],
          compact: true,
        },
      });

      fileList.data.rows.forEach((file: FileDoc) => {
        fileTable.push([
          file.originalName,
          file.type,
          fileSize(file.size, { round: 1 }),
          date.format(new Date(file.createdAt), "YYYY-MM-DD hh:mm A"),
        ]);
      });

      this.log(fileTable.toString());
    } catch (error) {
      this.error(
        `Could not retrieve uploaded file list from the server.\nError: ${error.message}`
      );
    }
  }
}
