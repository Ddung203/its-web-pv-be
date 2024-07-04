"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../configs/config.js");
const HttpStatusCode_1 = __importDefault(require("../utils/HttpStatusCode"));
const error_1 = require("../responses/error");
const User_1 = __importDefault(require("../models/User"));
const authentication = (array) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.slice(7);
            if (!token) {
                throw new error_1.AuthFailureError("Token is required!", HttpStatusCode_1.default.UNAUTHORIZED);
            }
            const data = await new Promise((resolve, reject) => {
                (0, jsonwebtoken_1.verify)(token, config_1.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(decoded);
                });
            });
            const filter = { createdAt: 0, updatedAt: 0 };
            const user = await User_1.default.findOne({ studentCode: data.studentCode }, filter);
            if (user && array.indexOf(user.role) >= 0) {
                req.auth = user;
                return next();
            }
            else {
                throw new error_1.AuthFailureError("Invalid token! User does not exist!", HttpStatusCode_1.default.UNAUTHORIZED);
            }
        }
        catch (error) {
            next(error);
        }
    };
};
exports.default = authentication;
