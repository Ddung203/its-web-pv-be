import express from "express";
import asyncHandle from "./utils/asyncHandle";
// import { InternalServerError } from "./responses/error";

const router = express.Router();

// Ping endpoint
router.get(
  "/ping",
  asyncHandle((req, res, next) => {
    // next(new InternalServerError());
    return res.status(200).json("pong");
  }),
);

export default router;
