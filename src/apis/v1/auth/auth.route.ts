import express from "express";
import { validate } from "express-validation";
import AuthController from "./auth.controller";
import authValidator from "./auth.validation";
import authentication from "../../../middlewares/authentication";
import asyncHandle from "../../../utils/asyncHandle";

const router = express.Router();

// Auth endpoint
router.post("/login", validate(authValidator.login), asyncHandle(AuthController.loginHandle));

router.post(
  "/signup",
  authentication(["admin"]),
  validate(authValidator.signUp),
  asyncHandle(AuthController.signUpHandle),
);

router.post(
  "/reset-password",
  authentication(["admin"]),
  validate(authValidator.reset),
  asyncHandle(AuthController.resetPasswordHandle),
);

export { router as authRouter };
