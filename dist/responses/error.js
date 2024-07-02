"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ToManyRequestsError = exports.ForbiddenError = exports.NotFoundError = exports.AuthFailureError = exports.BadRequestError = exports.ConflictRequestError = void 0;
const HttpStatusCode_1 = __importDefault(require("~/utils/HttpStatusCode"));
const ReasonPhrase_1 = __importDefault(require("~/utils/ReasonPhrase"));
class ErrorResponse extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.CONFLICT, statusCode = HttpStatusCode_1.default.CONFLICT) {
        super(message, statusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.BAD_REQUEST, statusCode = HttpStatusCode_1.default.BAD_REQUEST) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.UNAUTHORIZED, statusCode = HttpStatusCode_1.default.UNAUTHORIZED) {
        super(message, statusCode);
    }
}
exports.AuthFailureError = AuthFailureError;
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.NOT_FOUND, statusCode = HttpStatusCode_1.default.NOT_FOUND) {
        super(message, statusCode);
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.FORBIDDEN, statusCode = HttpStatusCode_1.default.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.ForbiddenError = ForbiddenError;
class ToManyRequestsError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.TOO_MANY_REQUESTS, statusCode = HttpStatusCode_1.default.TOO_MANY_REQUESTS) {
        super(message, statusCode);
    }
}
exports.ToManyRequestsError = ToManyRequestsError;
class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.INTERNAL_SERVER_ERROR, statusCode = HttpStatusCode_1.default.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}
exports.InternalServerError = InternalServerError;
