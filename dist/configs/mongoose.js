"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoose = mongoose_1.default;
const config_1 = require("./config");
// const config: any = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
mongoose_1.default.Promise = require("bluebird");
async function connectDB() {
    try {
        await mongoose_1.default.connect(config_1.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
