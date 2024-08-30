import express from "express";
import { validate } from "express-validation";
import playValidator from "./play.validation";
import PlayController from "./play.controller";
import authentication from "../../../middlewares/authentication";
import asyncHandle from "../../../utils/asyncHandle";
import cacheMiddleware from "../../../middlewares/cacheMiddleware";

const router = express.Router();

// Play endpoint
router.route("/list").get(authentication(["admin"]), asyncHandle(PlayController.listPlays));

router
  .route("/status")
  .get(authentication(["admin", "interviewer"]), asyncHandle(PlayController.getListPlayByInterviewed));

router
  .route("/leaderboard")
  .get(authentication(["admin"]), cacheMiddleware("leaderboard"), asyncHandle(PlayController.leaderboard));

//! No test
router.route("/start").get(authentication(["user"]), asyncHandle(PlayController.startPlay));

router.route("/end").post(authentication(["user"]), asyncHandle(PlayController.endPlay));

router.post("/interview/:playID", authentication(["admin", "interviewer"]), PlayController.interview);

export { router as playRouter };
