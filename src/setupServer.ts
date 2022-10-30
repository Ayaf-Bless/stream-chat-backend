import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSessions from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";
import "express-async-errors";

const SERVER_PORT = 4000;

export class StreamChatServer {
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
  private securityMiddleware(app: Application) {
    app.use(
      cookieSessions({
        name: "session",
        keys: ["test1", "test2"],
        maxAge: 24 * 7 * 3600000,
        secure: false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
      })
    );
  }
  private standardMiddleware(app: Application) {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true }));
  }
  private routesMiddleware(app: Application) {}
  private globalErrorHandler(app: Application) {}
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      this.startHTTPServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }
  private createSocketIO(httpServer: http.Server) {}
  private startHTTPServer(httpServer: http.Server) {
    httpServer.listen(SERVER_PORT, () => {
      console.log("Server running on " + SERVER_PORT);
    });
  }
}
