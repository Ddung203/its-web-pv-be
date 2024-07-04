import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "~/responses/error";

const notFoundHandle = (req: Request, res: Response, next: NextFunction) => {
  const error: NotFoundError = new NotFoundError();
  next(error);
};

export default notFoundHandle;
