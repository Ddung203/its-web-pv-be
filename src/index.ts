import http from "http";
import * as dotenv from "dotenv";
import app from "./config/express";

dotenv.config();

const { PORT, ENVIRONMENT } = process.env;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
});
