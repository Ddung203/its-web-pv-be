import http from "http";
import app from "./configs/express";
import { connectDB } from "./configs/mongoose";
import { ALLOWED_IP, ENVIRONMENT, PORT } from "./configs/config";
import socketMain from "./sockets";
import { CDTGlobal } from "./types/global";
import client from "./databases/redis.database";

declare const global: CDTGlobal;

const server = http.createServer(app);

// const io = new Server(server, {
//   transports: ["websocket", "polling"],
//   cors: {
//     origin: ALLOWED_IP,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// global.io = io;
global.socketList = {};
global.userList = {};
global.userCount = 0;

const onListening = async () => {
  // MongoDB
  await connectDB();

  // SocketIO
  // global.io.on("connection", (socket: any) => socketMain(socket));

  // Redis
  client.connect();

  client.on("connect", () => {
    console.log("\x1b[33m%s\x1b[0m", "Đã kết nối tới Redis");
  });

  client.on("error", (err) => {
    console.error("Redis Client Error", err);
  });
};

server.listen(PORT, async () => {
  await onListening();

  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
});
