import { NextFunction, Request, Response } from "express";
import User from "~/models/User";
import { AuthenticatedRequest } from "~/types/Request";
import HttpStatusCode from "./../../../enums/HttpStatusCode";
import { BadRequestError } from "~/responses/error";

class UserController {
  static listUsers = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 1;
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const users = await User.List({ limit, skip, filter, sort });
      return res.status(200).json({
        success: true,
        payload: { users },
        message: "Get list of users",
      });
    } catch (error) {
      next(error);
    }
  };

  static me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    return res.status(200).json({
      success: true,
      payload: { user: req.auth },
      message: "Received account information successfully!",
    });
  };

  static getUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.studentCode);

    return res.status(200).json({
      success: true,
      payload: { user },
      message: "Received user information successfully!",
    });
  };

  static updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findByIdAndDelete(req.params.studentCode);
      const { studentCode, studentName, studentClass, studentPhone } = req.body;

      if (!user) {
        throw new BadRequestError("User not found!");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { studentCode, studentName, studentClass, studentPhone },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new BadRequestError("Failed to update user information!");
      }

      return res.status(200).json({
        success: true,
        payload: { user: updatedUser },
        message: "User information updated successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static removeUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.studentCode);
      if (!deletedUser) {
        throw new BadRequestError("User not found");
      }

      return res.status(HttpStatusCode.OK).json({ success: true, payload: { deletedUser }, message: "User deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
