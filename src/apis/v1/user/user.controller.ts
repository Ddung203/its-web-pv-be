import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "./../../../enums/HttpStatusCode";
import User from "../../../models/User";
import { AuthenticatedRequest } from "../../../types/Request";
import { BadRequestError } from "../../../responses/error";
import { omitData } from "../../../utils/pick";
import Play from "../../../models/Play";

class UserController {
  static listUsers = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const filter = req.query.filter ? JSON.parse(decodeURIComponent(req.query.filter as string)) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const users = await User.List({ limit, skip, filter, sort });
      return res.status(200).json({
        success: true,
        payload: { users: users.data, count: users.count, limit: users.limit, skip: users.skip },
        message: "Get list of users!",
      });
    } catch (error) {
      next(error);
    }
  };

  static findResult = async (req: Request, res: Response, next: NextFunction) => {
    const { studentCode, isPassed } = req.query;
    try {
      if (!studentCode || !isPassed) {
        return next(new BadRequestError("Query is missing!"));
      }

      const user = await User.findOne({ studentCode, isPassed });

      if (!user) {
        return next(new BadRequestError("User not found!"));
      }

      const userData = omitData({ fields: ["password"], object: user.toObject() });

      return res.status(200).json({
        success: true,
        payload: { user: userData },
        message: "Received user information successfully!",
      });
    } catch (error) {
      return next(error);
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
    try {
      const user = await User.findOne({ studentCode: req.params.studentCode });

      if (!user) throw new BadRequestError("User not found!");

      const playData = await Play.findOne({ userID: user._id }).select("-__v").exec();

      return res.status(200).json({
        success: true,
        payload: {
          user: omitData({ fields: ["password"], object: user.toObject() }),
          play: playData || null,
        },
        message: "Received user and play information successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findOne({ studentCode: req.params.studentCode });

      const { studentName, studentClass, studentPhone, studentHometown, role } = req.body;

      if (!user) {
        throw new BadRequestError("User not found!");
      }

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { studentName, studentClass, studentPhone, studentHometown, role },
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
