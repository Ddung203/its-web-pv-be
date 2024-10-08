import express from "express";
import { validate } from "express-validation";
import UserController from "./user.controller";
import userValidator from "./user.validation";
import authentication from "../../../middlewares/authentication";
import asyncHandle from "../../../utils/asyncHandle";

const router = express.Router();

// User endpoint
router.get("/list", authentication(["admin", "interviewer"]), asyncHandle(UserController.listUsers));

router.get("/find-result", asyncHandle(UserController.findResult));

router.get("/me", authentication(["admin", "interviewer", "user"]), asyncHandle(UserController.me));

router.get(
  "/infor/:studentCode",
  authentication(["user", "admin", "interviewer"]),
  validate(userValidator.get),
  asyncHandle(UserController.getUser),
);

router.put(
  "/update/:studentCode",
  authentication(["admin"]),
  validate(userValidator.update),
  asyncHandle(UserController.updateUser),
);

router.delete(
  "/remove/:studentCode",
  authentication(["admin"]),
  validate(userValidator.remove),
  asyncHandle(UserController.removeUser),
);

export { router as userRouter };
