import express, { Express } from "express";
import { StreamChatServer } from "./setupServer";

class Application {
  public init(): void {
    const app: Express = express();
    const server: StreamChatServer = new StreamChatServer(app);
    server.start();
  }
}

const application = new Application();
application.init();
