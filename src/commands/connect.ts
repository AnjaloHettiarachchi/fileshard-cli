import { Command, flags } from "@oclif/command";

const axios = require("axios").default;

export default class Connect extends Command {
  static description = "Connect with the FileShard.";

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static examples = ["$ fileshard connect"];

  async run() {
    this.parse(Connect);

    this.log("Connecting to FileShard server...");

    try {
      const res = await axios.get("http://localhost:3000/api/file/hello");
      res.status === 200
        ? this.log(
            "Connection established. Use list command to view uploaded files."
          )
        : this.log(res.statusText);
    } catch (error) {
      this.error(
        `Cannot establish a connection with FileShard server. Try again later...\nError: ${error.message}`
      );
    }
  }
}
