import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/Request";
import { AuthFailureError } from "../responses/error";
import HttpStatusCode from "../enums/HttpStatusCode";
import { API_KEY, JWT_SECRET } from "../configs/config";
import User from "../models/User";

const authentication = (array: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.slice(7);
      let api_key = req.header("x-api-key");

      if (!token) {
        throw new AuthFailureError("Token is required!", HttpStatusCode.UNAUTHORIZED);
      }

      if (!api_key || api_key !== API_KEY) {
        throw new AuthFailureError("API Key is missing or invalid!", HttpStatusCode.UNAUTHORIZED);
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
      const user = await User.findOne({ studentCode: data.user.studentCode }, filter);

      if (user && array.indexOf(user.role) >= 0) {
        req.auth = user;
        return next();
      } else {
        throw new AuthFailureError("Invalid token! Role does not have access rights!", HttpStatusCode.UNAUTHORIZED);
      }
    } catch (error) {
      next(error);
    }
  };
};

export default authentication;
