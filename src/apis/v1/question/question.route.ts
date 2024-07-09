import express from "express";
import { validate } from "express-validation";
import asyncHandle from "~/utils/asyncHandle";
import authentication from "~/middlewares/authentication";
import QuestionController from "./question.controller";
import questionValidator from "./question.validation";

const router = express.Router();

// Question endpoint
router.get("/list", authentication(["admin"]), asyncHandle(QuestionController.listQuestions));

router.post(
  "/create",
  authentication(["admin"]),
  validate(questionValidator.create),
  asyncHandle(QuestionController.createQuestion),
);

router.put(
  "/update/:questionID",
  authentication(["admin"]),
  validate(questionValidator.update),
  asyncHandle(QuestionController.updateQuestion),
);

router.delete("/delete/:questionID", authentication(["admin"]), asyncHandle(QuestionController.deleteQuestion));

export { router as questionRouter };
