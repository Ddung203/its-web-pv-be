import { NextFunction, Request, Response } from "express";
import { TooManyRequestsError } from "~/responses/error";

export const rateLimitOptions: any = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20000,
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    throw new TooManyRequestsError();
  },
};
