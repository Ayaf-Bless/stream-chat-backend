import * as dotenv from "dotenv";
import bunyan from "bunyan";

dotenv.config();

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_COOKIE_1: string | undefined;
  public SECRET_KEY_COOKIE_2: string | undefined;
  public CLIENT_URL: string | undefined;
  public PORT: string | undefined;
  public REDIS_HOST: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_COOKIE_1 = process.env.SECRET_KEY_COOKIE_1;
    this.SECRET_KEY_COOKIE_2 = process.env.SECRET_KEY_COOKIE_2;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.PORT = process.env.PORT;
    this.REDIS_HOST = process.env.REDIS_HOST;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }

  public validateConfig() {
    for (const [key, value] of Object.entries(this)) {
      if (!value) {
        throw new Error(`Configuration for ${key} is missing`);
      }
    }
  }
}

export const config: Config = new Config();
