import express, { Router } from "express";
import { pingRouter } from "./apis/v1/ping/ping.route";
import { authRouter } from "./apis/v1/auth/auth.route";
import { userRouter } from "./apis/v1/user/user.route";
import { questionRouter } from "./apis/v1/question/question.route";
import { playRouter } from "./apis/v1/play/play.route";
import { emailRouter } from "./apis/v1/email/email.route";
import { statRouter } from "./apis/v1/stat/stat.route";

const router: Router = express.Router();

router.use(pingRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/question", questionRouter);
router.use("/play", playRouter);
router.use("/email", emailRouter);
router.use("/stat", statRouter);

export default router;
