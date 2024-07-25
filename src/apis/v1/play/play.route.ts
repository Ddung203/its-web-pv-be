import express from "express";
import { validate } from "express-validation";
import asyncHandle from "~/utils/asyncHandle";
import authentication from "~/middlewares/authentication";
import playValidator from "./play.validation";
import PlayController from "./play.controller";

const router = express.Router();

// Play endpoint
router.route("/list").get(authentication(["admin"]), asyncHandle(PlayController.listPlays));

router
  .route("/status")
  .get(authentication(["admin", "interviewer"]), asyncHandle(PlayController.getListPlayByInterviewed));

router
  .route("/:playID")
  .delete(authentication(["admin"]), validate(playValidator.remove), asyncHandle(PlayController.remove));

router.route("/user/:userID").get(authentication(["admin"]), asyncHandle(PlayController.getPlayByUserID));

router.route("/leaderboard").get(authentication(["admin"]), asyncHandle(PlayController.leaderboard));

router.route("/leaderboard/me").get(authentication(["user"]), asyncHandle(PlayController.leaderboardMe));

//! No test
router.route("/start").get(authentication(["user"]), asyncHandle(PlayController.startPlay));

router.route("/end").get(authentication(["user"]), asyncHandle(PlayController.endPlay));

router.route("/continue").get(authentication(["user"]), asyncHandle(PlayController.continuePlay));

router.post("/interview/:playID", authentication(["admin", "interviewer"]), PlayController.interview);

export { router as playRouter };
