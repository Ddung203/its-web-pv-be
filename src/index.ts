import http from "http";
import app from "./configs/express";
import { connectDB } from "./configs/mongoose";
import { ENVIRONMENT, PORT } from "./configs/config";
import { CDTGlobal } from "./types/global";
import client from "./databases/redis.database";
import logger from "./configs/logger";

declare const global: CDTGlobal;

const server = http.createServer(app);

const onListening = async () => {
  // MongoDB
  await connectDB();

  // Redis
  client.connect();

  client.on("connect", () => {
    console.log("\x1b[33m%s\x1b[0m", "Đã kết nối tới Redis");
  });

  client.on("error", (err) => {
    console.error("Redis Client Error", err);
    logger.error("Redis Client Error", err);
  });
};

server.listen(PORT, async () => {
  await onListening();

  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
});
