import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import axios from "axios";
import cli from "cli-ux";
import * as path from "path";

const FormData = require("form-data");

export default class Upload extends Command {
  static description = "Upload a file to FileShard.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "file" }];

  async run() {
    try {
      const { args } = this.parse(Upload);
      const filepath = args.file;

      if (!fs.existsSync(filepath)) {
        return this.error("Invalid filepath");
      }

      const formData = new FormData();
      formData.append("file", fs.createReadStream(filepath));

      cli.action.start("Uploading file to the FileShard...");

      await axios.post("http://localhost:3000/api/file/upload", formData, {
        headers: formData.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      cli.action.stop("Uploaded!");

      this.log(
        `The file '${path.parse(filepath).base}' uploaded to the FileShard.`
      );
    } catch (error) {
      this.error(error);
    }
  }
}
