"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const formatValidationError_1 = __importDefault(require("../utils/formatValidationError"));
const errorHandle = (error, req, res, next) => {
    if (error instanceof express_validation_1.ValidationError) {
        return res.status(error.statusCode).json((0, formatValidationError_1.default)(error));
    }
    return res.status(error.status || 500).json({
        success: false,
        error: {
            statusCode: error.status || 500,
            name: error.name || "Server Error",
            message: error.message || "Internal Server Error",
        },
    });
};
exports.default = errorHandle;
