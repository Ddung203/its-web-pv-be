import express, { Router } from "express";
import { pingRouter } from "./apis/v1/ping/ping.route";
import { authRouter } from "./apis/v1/auth/auth.route";
import { userRouter } from "./apis/v1/user/user.route";
const router: Router = express.Router();

router.use(pingRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
