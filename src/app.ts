import express, { Express } from "express";
import { StreamChatServer } from "./setupServer";
import dbConnection from "./setupDatabase";
import { config } from "./config";

class Application {
  public init(): void {
    this.loadConfig();
    dbConnection();
    const app: Express = express();
    const server: StreamChatServer = new StreamChatServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application = new Application();
application.init();
