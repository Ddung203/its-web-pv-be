import express from "express";

const router = express.Router();

// Ping endpoint
router.get("/ping", (req, res) => res.send("pong"));

export default router;
