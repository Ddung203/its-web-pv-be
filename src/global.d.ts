// global.d.ts
import { Server } from "socket.io";

declare global {
  var Config: {
    foo: any;
    io: Server;
  };
  var foo: any;
}
export {};
