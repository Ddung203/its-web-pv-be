"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const format = (inputJson) => {
    const { name, message, statusCode, error } = inputJson;
    const standardFormat = {
        success: false,
        message: message || "Unknown error",
        error: {
            name: name || "Error",
            details: inputJson.details.body[0].message || "Unknown details",
        },
    };
    return standardFormat;
};
exports.default = format;
