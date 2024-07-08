import express, { Router } from "express";
import { pingRouter } from "./apis/v1/ping/ping.route";
import { authRouter } from "./apis/v1/auth/auth.route";
const router: Router = express.Router();

router.use(pingRouter);
router.use("/auth", authRouter);

export default router;
