import express from "express";
import { validate } from "express-validation";
import QuestionController from "./question.controller";
import questionValidator from "./question.validation";
import asyncHandle from "../../../utils/asyncHandle";
import cacheMiddleware from "../../../middlewares/cacheMiddleware";
import authentication from "../../../middlewares/authentication";

const router = express.Router();

// Question endpoint
router.get(
  "/list",
  authentication(["admin"]),
  cacheMiddleware("questions"),
  asyncHandle(QuestionController.listQuestions),
);

router.post(
  "/create",
  authentication(["admin"]),
  validate(questionValidator.create),
  asyncHandle(QuestionController.createQuestion),
);

router.post("/insert", authentication(["admin"]), asyncHandle(QuestionController.insertQuestions));

router.put(
  "/update/:questionID",
  authentication(["admin"]),
  validate(questionValidator.update),
  asyncHandle(QuestionController.updateQuestion),
);

router.delete("/delete/:questionID", authentication(["admin"]), asyncHandle(QuestionController.deleteQuestion));

export { router as questionRouter };
