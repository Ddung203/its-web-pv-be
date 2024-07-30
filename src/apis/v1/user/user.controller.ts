import { NextFunction, Request, Response } from "express";
import User from "~/models/User";
import { AuthenticatedRequest } from "~/types/Request";
import HttpStatusCode from "./../../../enums/HttpStatusCode";
import { BadRequestError } from "~/responses/error";
import { omitData } from "~/utils/pick";

class UserController {
  static listUsers = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const users = await User.List({ limit, skip, filter, sort });
      return res.status(200).json({
        success: true,
        payload: { users },
        message: "Get list of users!",
      });
    } catch (error) {
      next(error);
    }
  };

  static getListUsersByRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const role = req.query.role || "guest";

    try {
      let filter = "studentCode studentName studentClass studentHometown studentPhone status role";

      if (req.auth.role === "admin") {
        filter = `${filter} password`;
      }

      const users = await User.find({ role }, filter);

      return res.status(200).json({
        success: true,
        payload: { users },
        message: `Get list of ${role} users!`,
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
    const user = await User.findOne({ studentCode: req.params.studentCode });

    if (!user) throw new BadRequestError("User not found!");

    return res.status(200).json({
      success: true,
      payload: { user: omitData({ fields: ["password"], object: user.toObject() }) },
      message: "Received user information successfully!",
    });
  };

  static updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ studentCode: req.params.studentCode });

      const { studentName, studentClass, studentPhone } = req.body;

      if (!user) {
        throw new BadRequestError("User not found!");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { studentName, studentClass, studentPhone },
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
      const user = await User.findOne({ studentCode: req.params.studentCode });

      if (!user) {
        throw new BadRequestError("User not found!");
      }
      await User.findByIdAndDelete(user._id);

      return res
        .status(HttpStatusCode.OK)
        .json({ success: true, payload: { deletedUser: user }, message: "User deleted!" });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
