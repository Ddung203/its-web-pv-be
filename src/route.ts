import express, { Router } from "express";
import { pingRouter } from "./apis/v1/ping/ping.route";

const router: Router = express.Router();

router.use(pingRouter);

export default router;
