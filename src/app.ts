import express, { Express } from "express";
import { StreamChatServer } from "./setupServer";
import dbConnection from "./setupDatabase";

class Application {
  public init(): void {
    dbConnection();
    const app: Express = express();
    const server: StreamChatServer = new StreamChatServer(app);
    server.start();
  }
}

const application = new Application();
application.init();
