import express from "express";
import statController from "./stat.controller";
import statValidator from "./stat.validation";
import authentication from "../../../middlewares/authentication";
import asyncHandle from "../../../utils/asyncHandle";

const router = express.Router();

// Stat endpoint
// router.get("/list", authentication(["admin", "interviewer"]), asyncHandle(statController.listUsers));

export { router as statRouter };
