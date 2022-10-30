import express, { Express } from "express";
import { StreamChatServer } from "@root/setupServer";
import dbConnection from "@root/setupDatabase";
import { config } from "@root/config";

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
