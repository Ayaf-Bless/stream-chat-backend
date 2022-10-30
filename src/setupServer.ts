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

import { config } from "./config";
// SOCKET.IO
import { Server } from "socket.io";

// REDIS
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

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
        keys: [config.SECRET_KEY_COOKIE_1!, config.SECRET_KEY_COOKIE_2!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== "development",
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
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
      const socketIo: Server = await this.createSocketIO(httpServer);
      this.startHTTPServer(httpServer);
      this.socketIOConnection(socketIo);
    } catch (error) {
      console.log(error);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTION"],
      },
    });
    const pubClient = createClient({
      url: config.REDIS_HOST,
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }
  private startHTTPServer(httpServer: http.Server) {
    httpServer.listen(+config.PORT!, () => {
      console.log("Server running on " + config.PORT);
    });
  }

  private socketIOConnection(io: Server): void {}
}
