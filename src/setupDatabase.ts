import mongoose from "mongoose";
import { config } from "./config";

export default function () {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        console.log("successfully connected to the DB");
      })
      .catch((err) => {
        console.log("Error connecting to DB", err);
        return process.exit();
      });
  };

  connect();
  mongoose.connection.on("disconnected", connect);
}
