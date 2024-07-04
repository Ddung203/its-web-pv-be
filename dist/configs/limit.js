"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitOptions = void 0;
const error_1 = require("../responses/error");
exports.rateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 2,
    standardHeaders: "draft-7",
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (req, res, next, options) => {
        throw new error_1.TooManyRequestsError();
    },
};
