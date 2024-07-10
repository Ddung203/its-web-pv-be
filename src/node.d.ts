// node.d.ts
import { Server } from "socket.io";

declare global {
  declare namespace NodeJS {
    interface Global {
      foo: {
        io: Server;
        socketList: Record<string, any>;
        userList: Record<string, any>;
        userCount: number;
      };
    }
  }
}
