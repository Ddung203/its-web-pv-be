import express from "express";
import { validate } from "express-validation";
import asyncHandle from "./utils/asyncHandle";
import authValidator from "./apis/v1/auth/validation";
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

//
router.post(
  "/ping",
  validate(authValidator.login),
  asyncHandle((req, res, next) => {
    console.log("req.body :>> ", req.body);
    return res.status(200).json({ req: req.body });
  }),
);

export default router;
