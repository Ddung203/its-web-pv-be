import express from "express";
import EmailController from "./email.controller";
import asyncHandle from "../../../utils/asyncHandle";
import emailValidator from "./email.validation";
import { validate } from "express-validation";
import authentication from "../../../middlewares/authentication";

const router = express.Router();

// Email endpoint
router.post("/feedback", validate(emailValidator.feedback), asyncHandle(EmailController.sendFeedback));

router.post("/sendEmails", authentication(["admin"]), asyncHandle(EmailController.sendEmails));

export { router as emailRouter };
