import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8181;
export const ENVIRONMENT = process.env.ENVIRONMENT || "development";
export const API_VERSION = process.env.API_VERSION || "/api/v1";
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "ES2USMdGFxZ3MuLNQrb9";
