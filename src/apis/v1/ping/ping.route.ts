import express from "express";
import PingController from "./ping.controller";

const router = express.Router();

// Ping endpoint
router.get("/ping", PingController.ping);
router.get("/provinces", PingController.getProvinces);

export { router as pingRouter };
