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
import Logger from "bunyan";

// SOCKET.IO
import { Server } from "socket.io";

// REDIS
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import {
  CustomError,
  IErrorResponse,
} from "./shared/globals/helpers/error-handler";
import applicationRoutes from "./routes";
import { config } from "./config";

const log: Logger = config.createLogger("server");

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

  private routesMiddleware(app: Application) {
    applicationRoutes(app);
  }

  private globalErrorHandler(app: Application) {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });
    app.use(
      (
        error: IErrorResponse,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.error(error);

        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      const socketIo: Server = await this.createSocketIO(httpServer);
      this.startHTTPServer(httpServer);
      this.socketIOConnection(socketIo);
    } catch (error) {
      log.error(error);
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
    log.info(`the has started with the process of ${process.pid}`);
    httpServer.listen(+config.PORT!, () => {
      log.info("Server running on " + config.PORT);
    });
  }

  private socketIOConnection(io: Server): void {}
}
