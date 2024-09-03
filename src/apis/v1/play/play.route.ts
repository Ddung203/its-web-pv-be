import express from "express";
import PlayController from "./play.controller";
import authentication from "../../../middlewares/authentication";
import asyncHandle from "../../../utils/asyncHandle";
import cacheMiddleware from "../../../middlewares/cacheMiddleware";

const router = express.Router();

// Play endpoint

router.get("/list", authentication(["admin"]), asyncHandle(PlayController.listPlays));

router.get(
  "/leaderboard",
  authentication(["admin"]),
  cacheMiddleware("leaderboard"),
  asyncHandle(PlayController.leaderboard),
);

router.get("/start", authentication(["user"]), asyncHandle(PlayController.startPlay));

router.post("/end", authentication(["user"]), asyncHandle(PlayController.endPlay));

router.post("/interview/:userID", authentication(["admin", "interviewer"]), PlayController.interview);

export { router as playRouter };
