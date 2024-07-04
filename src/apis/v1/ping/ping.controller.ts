import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "~/types/Request";

class PingController {
  static ping = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    return res.status(200).json("pong");
  };

  static pingData = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any, Record<string, any>>> => {
    return res.status(200).json({
      body: req.body,
      auth: req.auth,
    });
  };
}

export default PingController;
