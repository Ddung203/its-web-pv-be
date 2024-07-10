import http from "http";
import { Server } from "socket.io";
import app from "./configs/express";
import { connectDB } from "./configs/mongoose";
import { ALLOWED_IP, ENVIRONMENT, PORT } from "./configs/config";
import socketMain from "./sockets";
import { Socket } from "dgram";

const server = http.createServer(app);

const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: ALLOWED_IP,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

interface Foo {
  io: Server;
  socketList: Record<string, Socket>;
  userList: Record<string, any>; // Thay any bằng kiểu dữ liệu người dùng của bạn
  userCount: number;
}

const foo: Foo = {
  io: io,
  socketList: {},
  userList: {},
  userCount: 0,
};

server.listen(PORT, async () => {
  await connectDB();
  console.log("\x1b[33m%s\x1b[0m", `Server started on port ${PORT} (${ENVIRONMENT} mode)`);

  foo.io.on("connection", (socket: any) => socketMain(socket));
});
