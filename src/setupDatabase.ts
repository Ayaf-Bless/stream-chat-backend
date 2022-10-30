import mongoose from "mongoose";

export default function () {
  const connect = () => {
    mongoose
      .connect("mongodb://localhost:27017/stream_chat_backend")
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
