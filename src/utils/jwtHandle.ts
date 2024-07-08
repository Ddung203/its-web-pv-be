import jwt from "jsonwebtoken";
import { JWT_SECRET } from "~/configs/config";
import { ForbiddenError } from "~/responses/error";
const { sign, verify } = jwt;

class jwtHandler {
  static createTokenPair = async (payload: any) => {
    try {
      if (!JWT_SECRET) {
        throw new ForbiddenError("JWT_SECRET not found! Please set JWT_SECRET environment variable!");
      }

      const accessToken = sign(payload, JWT_SECRET, {
        expiresIn: "1 days",
      });

      const refreshToken = sign(payload, JWT_SECRET, {
        expiresIn: "15 days",
      });

      return { accessToken, refreshToken };
    } catch (error) {
      console.error(">> Token creation failed: ", error);
      throw error;
    }
  };

  static verifyJWT = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!JWT_SECRET) {
        reject(new ForbiddenError("JWT_SECRET not found! Please set JWT_SECRET environment variable!"));
        return;
      }

      verify(token, JWT_SECRET, (error: any, decoded: any) => {
        if (error) {
          reject(new ForbiddenError(`Invalid token: (${error.message})!`));
        } else {
          resolve(decoded);
        }
      });
    });
  };
}

export default jwtHandler;
