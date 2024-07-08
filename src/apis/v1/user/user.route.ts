import express from "express";
import { validate } from "express-validation";
import UserController from "./user.controller";
import asyncHandle from "~/utils/asyncHandle";
import userValidator from "./user.validation";
import authentication from "~/middlewares/authentication";

const router = express.Router();

// User endpoint
router.get("/list", authentication(["admin"]), asyncHandle(UserController.listUsers));
router.get("/me", authentication(["admin"]), asyncHandle(UserController.me));

router.get("/user/:studentCode", authentication(["user", "admin"]), asyncHandle(UserController.getUser));

router.put("/update/:studentCode", authentication(["admin"]), asyncHandle(UserController.updateUser));
router.delete("/remove/:studentCode", authentication(["admin"]), asyncHandle(UserController.removeUser));

export { router as userRouter };
