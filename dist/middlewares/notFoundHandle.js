"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../responses/error");
const notFoundHandle = (req, res, next) => {
    const error = new error_1.NotFoundError();
    next(error);
};
exports.default = notFoundHandle;
