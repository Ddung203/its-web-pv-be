import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import { BadRequestError } from "~/responses/error";
import Question from "~/models/Question";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "~/types/Request";
import client from "~/databases/redis.database";
import { CDTGlobal } from "~/types/global";

class QuestionController {
  static listQuestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const key = `user:${req.auth.studentCode}:question`;

      const cachedData = await client.get(key);

      if (cachedData) {
        const questions = JSON.parse(cachedData);

        const diff = process.hrtime(start);
        const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6; // milliseconds

        console.log(`Response time from cache: ${responseTime}ms`);

        return res.status(200).json({
          success: true,
          payload: { questions },
          message: "Retrieved list of questions from cache!",
        });
      }

      const questions = await Question.List({ limit, skip, filter, sort });
      const value = JSON.stringify(questions);

      await client.set(key, value, {
        EX: 60,
      });

      const diff = process.hrtime(start);
      const responseTime = (diff[0] * 1e9 + diff[1]) / 1e6; // milliseconds

      console.log(`Response time from DB: ${responseTime}ms`);

      return res.status(200).json({
        success: true,
        payload: { questions },
        message: "Get list of questions!",
      });
    } catch (error) {
      next(error);
    }
  };

  static createQuestion = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { code, imageURL, content, options, correctAnswer, level } = req.body;
    try {
      const key = `user:${req.auth.studentCode}:question`;
      client.del(key);
      const newQuestion = await Question.create({ code, imageURL, content, options, correctAnswer, level });

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        payload: {
          question: newQuestion.toObject(),
        },
        message: "Question created successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static insertQuestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { questions } = req.body;
    try {
      const key = `user:${req.auth.studentCode}:question`;
      client.del(key);

      const newQuestions = await Question.insertMany(questions);

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        payload: {
          questions: newQuestions,
        },
        message: "Questions created successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!(typeof req.params.questionID === "string" && /^[a-fA-F0-9]{24}$/.test(req.params.questionID))) {
        throw new BadRequestError("Invalid question ID!");
      }

      let questionID = new mongoose.Types.ObjectId(req.params.questionID);

      const question = await Question.findOne({ _id: questionID });

      if (!question) throw new BadRequestError("Question not found!");

      const { imageURL, content, options, correctAnswer, level } = req.body;

      const updatedQuestion = await Question.findByIdAndUpdate(
        questionID,
        { imageURL, content, options, correctAnswer, level },
        { new: true, runValidators: true },
      );

      if (!updatedQuestion) throw new BadRequestError("Question not found!");

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        payload: {
          question: updatedQuestion.toObject(),
        },
        message: "Question updated successfully!",
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //! Tao phuong thuc
      if (!(typeof req.params.questionID === "string" && /^[a-fA-F0-9]{24}$/.test(req.params.questionID))) {
        throw new BadRequestError("Invalid question ID!");
      }

      let questionID = new mongoose.Types.ObjectId(req.params.questionID);

      const question = await Question.findOne({ _id: questionID });

      if (!question) throw new BadRequestError("Question not found!");

      await Question.findByIdAndDelete({ _id: question._id });

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        payload: {
          question: question.toObject(),
        },
        message: "Question deteted successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default QuestionController;
