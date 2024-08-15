// login.ts

import CONST from "../constants";
import NAMESPACE from "../enums/Namespaces";
import User from "../models/User";
import { CDTGlobal } from "../types/global";
import jwtHandler from "../utils/jwtHandle";
import validObjectId from "../utils/validObjectId";

declare const global: CDTGlobal;

const errorWithMessage = (socket: any, message: string) => {
  socket.emit(NAMESPACE.AUTH, {
    command: CONST.RETURN.AUTH.LOGIN,
    code: 2,
    message,
  });
  socket.disconnect("Unauthorized!");
};

const success = (socket: any, user: any) => {
  if (user.role === "user") {
    socket.broadcast.emit(NAMESPACE.AUTH, {
      command: CONST.RETURN.AUTH.USER_GO_ONLINE,
      user: {
        studentCode: user.studentCode,
        studentName: user.studentName,
      },
    });
    global.userCount++;
  }

  global.socketList[socket.id] = user._id;
  global.userList[user._id] = socket.id;
  // global.hshIdSocket[socket.id] = socket;
  user.isOnline = true;
  user.save();
  console.log(`${global.userCount} users online now!`);
  console.log(`${user.studentName} - ${user.studentCode} is online!`);
};

const handleTokenVerification = async (socket: any, token: any) => {
  try {
    const decoded = await jwtHandler.verifyJWT(token);
    return decoded?.user;
  } catch (error) {
    errorWithMessage(socket, "jwt.verify: Authentication failed!");
  }
};

export default function (socket: any) {
  try {
    return async function (data: any) {
      if (data.command === CONST.RECEIVE.LOGIN.AUTH) {
        const { token } = data;
        if (!token) {
          errorWithMessage(socket, "Authentication failed. Token is missing.");
          return;
        }

        try {
          const decoded = await handleTokenVerification(socket, token);

          const user = await User.findOne({ _id: validObjectId(decoded._id) });

          if (!user) {
            errorWithMessage(socket, "Authentication failed.");
            return;
          }

          if (global.userList.hasOwnProperty(user.id)) {
            errorWithMessage(socket, "User already online.");
            return;
          }

          success(socket, user);
        } catch (error) {
          errorWithMessage(socket, "Authentication failed.");
          throw error;
        }
      }
    };
  } catch (error) {
    console.log(error);
  }
}
