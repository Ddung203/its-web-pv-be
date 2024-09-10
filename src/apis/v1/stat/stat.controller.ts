import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import { BadRequestError } from "../../../responses/error";
import Stat from "../../../models/Stat";
import User from "../../../models/User";
import Question from "../../../models/Question";

class StatController {
  static async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10, skip = 0, sort = { createdAt: -1 }, filter = {} } = req.query;

      const parsedLimit = parseInt(limit as string, 10);
      const parsedSkip = parseInt(skip as string, 10);
      const parsedSort = JSON.parse(sort as string);
      const parsedFilter = JSON.parse(filter as string);

      const result = await Stat.List({
        limit: parsedLimit,
        skip: parsedSkip,
        sort: parsedSort,
        filter: parsedFilter,
      });

      res.status(HttpStatusCode.OK).json({
        message: "Lấy danh sách thành công",
        data: result.data,
        count: result.count,
        limit: result.limit,
        skip: result.skip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { websiteViews } = req.body;

      const newStat = new Stat({
        websiteViews,
      });

      await newStat.save();

      res.status(HttpStatusCode.CREATED).json({
        message: "Thống kê đã được tạo thành công",
        data: newStat,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { websiteViews } = req.body;

      const updatedStat = await Stat.findByIdAndUpdate(id, { websiteViews }, { new: true, runValidators: true });

      if (!updatedStat) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Không tìm thấy thống kê",
        });
      }

      res.status(HttpStatusCode.OK).json({
        message: "Cập nhật thống kê thành công",
        data: updatedStat,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deletedStat = await Stat.findByIdAndDelete(id);

      if (!deletedStat) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: "Không tìm thấy thống kê",
        });
      }

      res.status(HttpStatusCode.OK).json({
        message: "Xóa thống kê thành công",
        data: deletedStat,
      });
    } catch (error) {
      next(error);
    }
  }

  static async visit(req: Request, res: Response, next: NextFunction) {
    try {
      let stat = await Stat.findOne();
      if (!stat) {
        stat = new Stat();
      }

      // Tăng số lượt truy cập
      stat.websiteViews += 1;
      await stat.save();

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          websiteViews: stat.websiteViews,
        },
        message: "Get web views successfully!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStat(req: Request, res: Response, next: NextFunction) {
    try {
      let stat = await Stat.findOne();

      const countUser = await User.countDocuments({ role: "user" });
      const countUserTested = await User.countDocuments({ isTested: 1 });
      const countUserInterviewed = await User.countDocuments({ isInterviewed: 1 });
      const countUserPassed = await User.countDocuments({ isPassed: 1 });

      const questions = await Question.find();
      const users = await User.find().select("-createdAt -updatedAt -__v ");
      const usersTested = await User.find({ isTested: 1 }).select("-createdAt -updatedAt -__v ");
      const usersInterviewed = await User.find({ isInterviewed: 1 }).select("-createdAt -updatedAt -__v ");
      const usersPassed = await User.find({ isPassed: 1 }).select("-createdAt -updatedAt -__v ");
      const usersMailed = await User.find({ isReceivedMail: 1 }).select("-createdAt -updatedAt -__v ");

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          websiteViews: stat?.websiteViews || 0,
          countUser: countUser || 0,
          countUserTested: countUserTested || 0,
          countUserInterviewed: countUserInterviewed || 0,
          countUserPassed: countUserPassed || 0,
          questions,
          users,
          usersTested,
          usersInterviewed,
          usersPassed,
          usersMailed,
        },
        message: "Get web stat successfully!",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StatController;
