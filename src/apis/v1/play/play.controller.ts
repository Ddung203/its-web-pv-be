import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import Play from "../../../models/Play";
import validObjectId from "../../../utils/validObjectId";
import { BadRequestError, ConflictRequestError, NotFoundError } from "../../../responses/error";
import RedisService from "../../../services/redis.service";
import User from "../../../models/User";
import { AuthenticatedRequest } from "../../../types/Request";
import Question from "../../../models/Question";

interface PopulatedPlay {
  _id: Types.ObjectId;
  userID: {
    _id: Types.ObjectId;
    studentCode: string;
    studentName: string;
    studentClass: string;
    image: string;
  };
  interviewer: string;
  interviewScore: number;
  isInterviewed: boolean;
  comment: string;
  score: number;
  totalScore: number;
}

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

  static getListPlayByInterviewed = async (req: Request, res: Response, next: NextFunction) => {
    const interviewed = req.query.interviewed || false;

    try {
      // ! Warning
      const plays = await Play.find({ isInterviewed: interviewed }).populate({
        path: "userID",
        select: "studentCode studentName studentClass studentHometown",
        populate: [{ path: "_id", select: "content" }],
      });

      return res.status(200).json({
        success: true,
        payload: { plays },
        message: `isInterviewed: ${interviewed}`,
      });
    } catch (error) {
      next(error);
    }
  };

  static remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playID } = req.params;
      const play = await Play.findOne({ _id: validObjectId(playID) });

      if (!play) throw new NotFoundError("Play not found!");

      await Play.findByIdAndDelete({ _id: play._id });

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: play.toObject(),
        },
        message: "Play deteted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  static getPlayByUserID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userID } = req.params;

      // ?
      const play = await Play.findOne({ userID: validObjectId(userID) })
        .populate({
          path: "userID",
          select: "studentName studentCode",
          populate: [{ path: "_id", select: "content" }],
        })
        .populate({
          path: "questions.questionID",
          select: "-correctAnswer",
        });

      if (!play) throw new NotFoundError(`Cannot found play by userID: ${userID}!`);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: play.toObject(),
        },
        message: "Found play by userID successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static leaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plays = await Play.aggregate<PopulatedPlay>()
        .project({
          userID: 1,
          interviewer: 1,
          interviewScore: 1,
          isInterviewed: 1,
          comment: 1,
          score: 1,
          totalScore: { $add: ["$score", "$interviewScore"] },
        })
        .sort({ totalScore: -1 });

      if (!plays || plays.length === 0) {
        throw new BadRequestError("Dữ liệu trống!");
      }

      await Play.populate(plays, {
        path: "userID",
        select: { studentCode: 1, studentName: 1, studentClass: 1, image: 1 },
      });

      const formattedPlays = plays.map((item) => ({
        _id: item._id,
        userID: item.userID._id,
        studentCode: item.userID.studentCode,
        studentName: item.userID.studentName,
        studentClass: item.userID.studentClass,
        totalScore: item.totalScore,
        interviewScore: item.interviewScore,
        isInterviewed: item.isInterviewed,
        comment: item.comment,
        interviewer: item.interviewer,
        score: item.score,
      }));

      // Caching results
      RedisService.set(
        "leaderboard",
        {
          plays: formattedPlays,
        },
        {
          EX: 3600,
        },
      );

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          plays: formattedPlays,
        },
        message: "Get leaderboard successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static leaderboardMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    const user = await User.findOne({ studentCode });
    if (!user) throw new NotFoundError("User not found!");

    const play = await Play.findOne(
      { userID: user._id },
      { interviewScore: 0, isInterviewed: 0, createdAt: 0, updatedAt: 0, __v: 0 },
    );

    if (!play) throw new NotFoundError(`Cannot find play by me: ${studentCode} - ${req.auth.studentName}!`);

    return res.status(HttpStatusCode.OK).json({
      success: true,
      payload: {
        play,
      },
      message: "Get leaderboard about me successfully!",
    });
  };

  static startPlay = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    if (studentCode) {
      const user = await User.findOne({ studentCode });
      if (!user) throw new BadRequestError("User not found!");

      if (user && user.role === "user") {
        const play = await Play.findOne({ userID: user._id });
        if (play) throw new ConflictRequestError("User already started a play!");

        const TIME_TEST = 20; // 20 minutes

        const newPlay = new Play({
          userID: user._id,
          questions: await Question.Random(20),
          timeOut: new Date(Date.now() + TIME_TEST * 60000),
        });

        try {
          const result = await newPlay.save();
          const r = await result.populate("questions.questionID", "options content");

          return res.status(HttpStatusCode.OK).json({
            success: true,
            payload: {
              play: r.toObject(),
            },
            message: "Start play successfully!",
          });
        } catch (error) {
          next(error);
        }
      } else {
        throw new BadRequestError("User role is not user!");
      }
    }
  };

  static endPlay = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    if (!studentCode) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Student code is required!",
      });
    }

    try {
      const user = await User.findOne({ studentCode });
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found!",
        });
      }

      if (user.role !== "user") {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User role is not user!",
        });
      }

      const play = await Play.findOne({ userID: user._id });
      if (!play) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Play session not found!",
        });
      }

      play.timeOut = new Date(Date.now());
      const result = await play.save();
      const populatedResult = await result.populate("questions.questionID", "options content");

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: populatedResult.toObject(),
        },
        message: "End play successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static continuePlay = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode } = req.auth;
    if (!studentCode) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Student code is required!",
      });
    }

    try {
      const user = await User.findOne({ studentCode });
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found!",
        });
      }

      if (user.role !== "user") {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User role is not user!",
        });
      }

      const play = await Play.findOne(
        { userID: user._id },
        { interviewScore: 0, isInterviewed: 0, createdAt: 0, updatedAt: 0, __v: 0 },
      ).populate("questions.questionID", "options content");

      if (!play) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Play session not found!",
        });
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          play: play.toObject(),
        },
        message: "Continue play successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static interview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { interviewScore, comment, interviewer } = req.body;

    try {
      const play = await Play.findById(validObjectId(req.params.playID));
      if (!play) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Play session not found!",
        });
      }

      if (!play.isInterviewed) {
        play.interviewScore = interviewScore;
        play.comment = comment;
        play.interviewer = interviewer;
        play.isInterviewed = true;

        const result = await play.save();
        await User.findOneAndUpdate({ _id: play.userID }, { status: 1 });

        RedisService.del(["leaderboard"]);

        return res.status(HttpStatusCode.OK).json({
          success: true,
          payload: {
            play: result.toObject(),
          },
          message: "Interview completed successfully!",
        });
      } else {
        return res.status(HttpStatusCode.FORBIDDEN).json({
          success: false,
          payload: {
            play: play.toObject(),
          },
          message: "Student has already been interviewed!",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default PlayController;
