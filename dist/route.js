"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ping_route_1 = require("./apis/v1/ping/ping.route");
const router = express_1.default.Router();
router.use(ping_route_1.pingRouter);
exports.default = router;
