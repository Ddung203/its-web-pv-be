import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import { BadRequestError } from "~/responses/error";
import Question from "~/models/Question";
import mongoose from "mongoose";

class QuestionController {
  static listQuestions = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string, 10) || 50;
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 };

    try {
      const questions = await Question.List({ limit, skip, filter, sort });
      return res.status(200).json({
        success: true,
        payload: { questions },
        message: "Get list of questions!",
      });
    } catch (error) {
      next(error);
    }
  };

  static createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    const { code, imageURL, content, options, correctAnswer, level } = req.body;
    try {
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

  static insertQuestions = async (req: Request, res: Response, next: NextFunction) => {
    const { questions } = req.body;
    try {
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
