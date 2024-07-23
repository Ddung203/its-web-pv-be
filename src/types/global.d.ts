import Global = NodeJS.Global;
import { Server } from "socket.io";

export interface CDTGlobal extends Global {
  io: Server;
  socketList: Record<string, any>;
  userList: Record<string, any>;
  userCount: number;
}
