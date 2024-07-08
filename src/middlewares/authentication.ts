import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "~/configs/config";
import HttpStatusCode from "~/enums/HttpStatusCode";
import { AuthFailureError } from "~/responses/error";
import User from "~/models/User";
import { AuthenticatedRequest } from "~/types/Request";

const authentication = (array: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.slice(7);
      if (!token) {
        throw new AuthFailureError("Token is required!", HttpStatusCode.UNAUTHORIZED);
      }

      const data: any = await new Promise((resolve, reject) => {
        verify(token, JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });

      const filter = { createdAt: 0, updatedAt: 0 };
      const user = await User.findOne({ studentCode: data.studentCode }, filter);
      if (user && array.indexOf(user.role) >= 0) {
        req.auth = user;
        return next();
      } else {
        throw new AuthFailureError("Invalid token! User does not exist!", HttpStatusCode.UNAUTHORIZED);
      }
    } catch (error) {
      next(error);
    }
  };
};

export default authentication;
