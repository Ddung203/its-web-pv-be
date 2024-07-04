import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import format from "~/utils/formatValidationError";

const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
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
