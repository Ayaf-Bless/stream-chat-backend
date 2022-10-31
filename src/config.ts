import * as dotenv from "dotenv";
import bunyan from "bunyan";
import cloudinary from "cloudinary";

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
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET_KEY: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_COOKIE_1 = process.env.SECRET_KEY_COOKIE_1;
    this.SECRET_KEY_COOKIE_2 = process.env.SECRET_KEY_COOKIE_2;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.PORT = process.env.PORT;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.CLOUD_NAME = process.env.CLOUD_NAME;
    this.CLOUD_API_KEY = process.env.CLOUD_API_KEY;
    this.CLOUD_API_SECRET_KEY = process.env.CLOUD_API_SECRET_KEY;
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

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET_KEY
    });
  }
}

export const config: Config = new Config();
