import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import { Server } from "http";

export class StreamChatServer {
  //   private app: Application;

  constructor(private app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application) {}
  private standardMiddleware(app: Application) {}
  private routesMiddleware(app: Application) {}
  private globalErrorHandler(app: Application) {}
  private startServer(app: Application) {}
  private createSocketIO(httpServer: Server) {}
  private startHTTPServer(httpServer: Server) {}
}
