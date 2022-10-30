import mongoose from "mongoose";
import { config } from "./config";

import Logger from "bunyan";

const log: Logger = config.createLogger("setup-db");
export default function () {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info("successfully connected to the DB");
      })
      .catch((err) => {
        log.error("Error connecting to DB", err);
        return process.exit();
      });
  };

  connect();
  mongoose.connection.on("disconnected", connect);
}
