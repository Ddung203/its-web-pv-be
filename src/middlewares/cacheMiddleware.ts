import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/Request";
import client from "../databases/redis.database";
import HttpStatusCode from "../enums/HttpStatusCode";

const cacheMiddleware = (key: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const cachedData = await client.get(key);

      if (cachedData) {
        return res.status(HttpStatusCode.OK).json({
          success: true,
          payload: JSON.parse(cachedData),
          message: `Data retrieved successfully from cache using key: ${key}!`,
        });
      } else {
        console.log(`Cache miss for key: ${key}`);
        next();
      }
    } catch (error) {
      console.error("Cache retrieval error:", error);
      next(error);
    }
  };
};

export default cacheMiddleware;
