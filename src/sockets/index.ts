import login from "./login";
import question from "./question";
import disconnect from "./disconnect";
import NAMESPACE from "~/enums/Namespaces";

// SocketIO.Socket
export default function (socket: any): void {
  socket.emit(NAMESPACE.LOGIN, { message: "Welcome to socket server!" });
  socket.on(NAMESPACE.LOGIN, login(socket));
  socket.on(NAMESPACE.QUESTION, question(socket));
  socket.on(NAMESPACE.DISCONNECT, disconnect(socket));
}
