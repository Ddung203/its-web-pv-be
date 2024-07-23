// disconnect.ts

import CONST from "~/constants";
import NAMESPACE from "~/enums/Namespaces";
import { Document, Types } from "mongoose";
import User from "~/models/User";
import { CDTGlobal } from "~/types/global";

declare const global: CDTGlobal;

const disconnectSuccess = (
  socket: any,
  user: Document<unknown, {}, IUser> &
    IUser & {
      _id: Types.ObjectId;
    },
) => {
  console.log(`${user.studentName} - ${user.studentCode} is now offline`);
  user.isOnline = false;
  if (user.role === "user") {
    global.userCount--;
  }

  socket.broadcast.emit(NAMESPACE.AUTH, {
    command: CONST.RETURN.AUTH.DISCONNECT,
    user: {
      studentName: user.studentName,
      studentCode: user.studentCode,
    },
  });

  delete global.socketList[socket.id];
  delete global.userList[user._id.toString()];
  user.save();
  console.log(`${global.userCount} users online now!`);
};

const handleUserDisconnection = async (socket: any) => {
  const userId = global.socketList[socket.id];
  if (!userId) {
    console.log("No user found for this socket ID");
    return;
  }

  try {
    const user = await User.findById(userId);
    if (user) {
      disconnectSuccess(socket, user);
    }
  } catch (error) {
    console.log(error);
  }
};

export default function (socket: any) {
  return function () {
    handleUserDisconnection(socket);
  };
}
