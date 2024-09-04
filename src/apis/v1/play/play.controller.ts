import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import Play from "../../../models/Play";
import validObjectId from "../../../utils/validObjectId";
import { BadRequestError, ConflictRequestError, NotFoundError } from "../../../responses/error";
import RedisService from "../../../services/redis.service";
import User from "../../../models/User";
import { AuthenticatedRequest } from "../../../types/Request";
import Question from "../../../models/Question";

class PlayController {
  static listPlays = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const plays = await Play.List({ limit, skip, filter, sort });
      return res.status(200).json({
        success: true,
        payload: { plays },
        message: "Get list of plays!",
      });
    } catch (error) {
      next(error);
    }
  };

  static leaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plays = await Play.aggregate([
        {
          $project: {
            userID: 1,
            interviewer: 1,
            interviewScore: { $ifNull: ["$interviewScore", 0] },
            comment: 1,
            score: { $ifNull: ["$score", 0] },
            totalScore: { $add: [{ $ifNull: ["$score", 0] }, { $ifNull: ["$interviewScore", 0] }] },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userID",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $project: {
            interviewer: 1,
            interviewScore: 1,
            comment: 1,
            score: 1,
            totalScore: 1,
            "userDetails.studentCode": 1,
            "userDetails.studentName": 1,
            "userDetails.studentClass": 1,
          },
        },
        {
          $sort: { totalScore: -1 },
        },
      ]).exec();

      try {
        await RedisService.set("leaderboard", { plays }, { EX: 30 });
      } catch (cacheError) {
        console.error("Error caching leaderboard data:", cacheError);
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: { plays },
        message: "Get leaderboard successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static startPlay = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    if (!studentCode) throw new BadRequestError("Student code is missing!");

    const user = await User.findOne({ studentCode });
    if (!user) throw new BadRequestError("User not found!");
    if (user && user.role !== "user") throw new BadRequestError("User role is not user!");

    const play = await Play.findOne({ userID: user._id });
    if (play) throw new ConflictRequestError("User already started a play!");

    const TIME_TEST = 20; // 20 minutes

    const questions = await Question.Random(20);

    const newPlay = new Play({
      userID: user._id,

      timeOut: new Date(Date.now() + TIME_TEST * 60000),
    });

    try {
      const result = await newPlay.save();

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: result.toObject(),
          questions,
        },
        message: "Start play successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static endPlay = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    const { answerArray } = req.body;

    if (!studentCode) throw new BadRequestError("Student code is required!");

    try {
      const user = await User.findOne({ studentCode });
      if (!user) throw new BadRequestError("User not found!");

      if (user.role !== "user") throw new BadRequestError("Role is not 'user'!");

      if (user.isTested !== 0) throw new BadRequestError("The user has already taken the test!");

      const play = await Play.findOne({ userID: user._id });
      if (!play) throw new BadRequestError("Play session not found!");

      let score = 0;

      answerArray.forEach((currentItem: any) => {
        if (currentItem.userAnswer === currentItem.correctAnswer) score += 5;
      });

      play.timeOut = new Date(Date.now());
      play.score = score;
      user.isTested = 1;
      const result = await play.save();
      await user.save();

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          result,
        },
        message: "End play successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static interview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { interviewScore, comment, interviewer } = req.body;
    const { userID } = req.params;

    try {
      const play = await Play.findOne({ userID: validObjectId(userID) });

      if (!play) throw new BadRequestError("Play session not found!");

      play.interviewScore = interviewScore;
      play.comment = comment;
      play.interviewer = interviewer;

      const result = await play.save();
      await User.findOneAndUpdate({ _id: play.userID }, { isInterviewed: 1 });

      RedisService.del(["leaderboard"]);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: result.toObject(),
        },
        message: "Interview completed successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PlayController;
