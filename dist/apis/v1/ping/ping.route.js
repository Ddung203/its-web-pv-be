"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validation_1 = require("express-validation");
const ping_controller_1 = __importDefault(require("./ping.controller"));
const ping_validation_1 = __importDefault(require("./ping.validation"));
const authentication_1 = __importDefault(require("../../../middlewares/authentication.js"));
const asyncHandle_1 = __importDefault(require("../../../utils/asyncHandle"));
const router = express_1.default.Router();
exports.pingRouter = router;
// Ping endpoint
router.get("/ping", ping_controller_1.default.ping);
router.post("/ping", (0, express_validation_1.validate)(ping_validation_1.default.login), (0, authentication_1.default)(["user"]), (0, asyncHandle_1.default)(ping_controller_1.default.pingData));
