import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import logger from "../configs/logger";
import format from "../utils/formatValidationError";

const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
  // Log thông tin chi tiết về lỗi
  logger.error(`[${error.status || 500}] - ${req.method} ${req.originalUrl} ${req.ip} - ${error} `, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    body: req.body,
    error: {
      status: error.status,
      message: error.message,
    },
  });

  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(format(error));
  }

  return res.status(error.status || 500).json({
    success: false,
    error: {
      statusCode: error.status || 500,
      name: error.name || "Server Error",
      message: error.message || "Internal Server Error",
    },
  });
};

export default errorHandle;
