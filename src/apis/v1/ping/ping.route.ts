import express from "express";
import { validate } from "express-validation";
import PingController from "./ping.controller";
import pingValidator from "./ping.validation";
import authentication from "~/middlewares/authentication";
import asyncHandle from "~/utils/asyncHandle";

const router = express.Router();

// Ping endpoint
router.get("/ping", PingController.ping);

router.post("/ping", validate(pingValidator.login), authentication(["user"]), asyncHandle(PingController.pingData));

export { router as pingRouter };
