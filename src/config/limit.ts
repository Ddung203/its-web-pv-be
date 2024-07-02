import { NextFunction, Request, Response } from "express";
import { ToManyRequestsError } from "~/responses/error";

export const rateLimitOptions: any = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500,
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    throw new ToManyRequestsError();
  },
};
