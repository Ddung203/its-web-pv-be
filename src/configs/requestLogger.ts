import { Request, Response, NextFunction } from "express";
import logger from "./logger";

let requestCount = 0;

setInterval(() => {
  requestCount = 0;
}, 900000);

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  requestCount++;
  logger.info(`Request #${requestCount}: ${req.method} ${req.originalUrl}`);
  next();
};

export default requestLogger;
