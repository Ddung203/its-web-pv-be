"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validation_1 = require("express-validation");
const pingValidator = {
    login: {
        body: express_validation_1.Joi.object({
            username: express_validation_1.Joi.string().alphanum().min(3).max(30).required(),
            password: express_validation_1.Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        }),
    },
};
exports.default = pingValidator;
