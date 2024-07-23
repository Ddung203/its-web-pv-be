import http from "http";
import { Server } from "socket.io";
import app from "./configs/express";
import { connectDB } from "./configs/mongoose";
import { ALLOWED_IP, ENVIRONMENT, PORT } from "./configs/config";
import socketMain from "./sockets";
import { CDTGlobal } from "./types/global";

declare const global: CDTGlobal;

const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: ALLOWED_IP,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

global.io = io;
global.socketList = {};
global.userList = {};
global.userCount = 0;

server.listen(PORT, async () => {
  await connectDB();

  global.io.on("connection", (socket: any) => socketMain(socket));

  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
});
