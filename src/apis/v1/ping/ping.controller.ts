import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "~/types/Request";

class PingController {
  static ping = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    return res.status(200).json({ success: true, message: "pong", payload: null, error: null });
  };
}

export default PingController;
