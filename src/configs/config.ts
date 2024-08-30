import { config } from "dotenv";

const result = config();

if (result.error) {
  console.error("Failed to load .env file", result.error);
  process.exit(1); // Exit process with failure
}

type Environment = "development" | "production" | "staging";

interface IConfig {
  ENVIRONMENT: Environment;
  PORT: number | string;
  API_VERSION: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  ALLOWED_IP: string;
  API_KEY: string;
  RD_PASSWORD: string;
  RD_HOST: string;
  RD_PORT: any;
}

const currentEnvironment: Environment = (process.env.NODE_ENV as Environment) || "development";

const defaultConfig: any = {};

const environmentConfig: Record<Environment, Partial<IConfig>> = {
  development: {
    ENVIRONMENT: currentEnvironment,
    PORT: process.env.PORT || 8181,
    API_VERSION: "/api/v1",
    MONGO_URI: "mongodb://localhost:27017/test",
    JWT_SECRET: "ES2USMdGFxZ3MuLNQrb9",
    ALLOWED_IP: "*",
    API_KEY: "e3090eddbe7dd2907912b221b2513be4",
    RD_PASSWORD: "",
    RD_HOST: "localhost",
    RD_PORT: 6379,
  },
  production: {
    ENVIRONMENT: currentEnvironment,
    PORT: process.env.PORT || 8181,
    API_VERSION: process.env.API_VERSION || "/api/v1",
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ALLOWED_IP: process.env.ALLOWED_IP,
    API_KEY: process.env.API_KEY,
    RD_PASSWORD: process.env.RD_PASSWORD,
    RD_HOST: process.env.RD_HOST,
    RD_PORT: process.env.RD_PORT,
  },
  staging: {
    ENVIRONMENT: currentEnvironment,
    PORT: process.env.PORT || 8181,
    API_VERSION: "/api/v1",
    MONGO_URI: "mongodb://localhost:27017/myapp_staging",
    JWT_SECRET: "StagingSecret",
    ALLOWED_IP: "*",
    API_KEY: "StagingAPIKey",
    RD_PASSWORD: "",
    RD_HOST: "localhost",
    RD_PORT: 6379,
  },
};

if (!environmentConfig[currentEnvironment]) {
  throw new Error(`Environment configuration for "${currentEnvironment}" is missing`);
}

const configs: IConfig = {
  ...defaultConfig,
  ...environmentConfig[currentEnvironment],
};

export const {
  ENVIRONMENT,
  PORT,
  API_VERSION,
  MONGO_URI,
  JWT_SECRET,
  ALLOWED_IP,
  API_KEY,
  RD_PASSWORD,
  RD_HOST,
  RD_PORT,
} = configs;
