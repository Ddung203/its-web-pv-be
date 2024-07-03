import http from "http";
import app from "./configs/express";
import { connectDB } from "./configs/mongoose";
import { ENVIRONMENT, PORT } from "./configs/config";

const server = http.createServer(app);

server.listen(PORT, async () => {
  await connectDB();
  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
});
