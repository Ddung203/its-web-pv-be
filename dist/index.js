"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("./configs/express"));
const mongoose_1 = require("./configs/mongoose");
const config_1 = require("./configs/config");
const server = http_1.default.createServer(express_1.default);
server.listen(config_1.PORT, async () => {
    await (0, mongoose_1.connectDB)();
    console.log("\x1b[33m%s\x1b[0m", `Server started on port ${config_1.PORT} (${config_1.ENVIRONMENT} mode)`);
});
