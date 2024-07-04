import { Request } from "express";

interface AuthenticatedRequest extends Request {
  auth?: any;
}
