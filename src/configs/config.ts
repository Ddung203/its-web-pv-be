import { config } from "dotenv";

const result = config();

if (result.error) {
  console.error("Failed to load .env file", result.error);
  process.exit(1); // Exit process with failure
}

const currentEnvironment: Environment = (process.env.NODE_ENV as Environment) || "development";

const defaultConfig: any = {};

const environmentConfig: Record<Environment, Partial<IConfig>> = {
  development: {
    ENVIRONMENT: currentEnvironment,
    PORT: process.env.PORT || 8181,
    API_VERSION: process.env.API_VERSION,
    MONGO_URI: process.env.MONGO_URI_DEV,
    JWT_SECRET: process.env.JWT_SECRET,
    ALLOWED_IP: ["http://localhost:5173", "http://localhost:4173", process.env.ALLOWED_IP],
    API_KEY: process.env.API_KEY,
    RD_PASSWORD: "",
    RD_HOST: "localhost",
    RD_PORT: 6379,
  },
  production: {
    ENVIRONMENT: currentEnvironment,
    PORT: process.env.PORT || 8181,
    API_VERSION: process.env.API_VERSION,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ALLOWED_IP: ["https://fe.ddung203.id.vn", process.env.ALLOWED_IP],
    API_KEY: process.env.API_KEY,
    RD_PASSWORD: process.env.RD_PASSWORD,
    RD_HOST: process.env.RD_HOST,
    RD_PORT: process.env.RD_PORT,
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
