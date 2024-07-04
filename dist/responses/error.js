"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.TooManyRequestsError = exports.ForbiddenError = exports.NotFoundError = exports.AuthFailureError = exports.BadRequestError = exports.ConflictRequestError = void 0;
const HttpStatusCode_1 = __importDefault(require("../utils/HttpStatusCode"));
const ReasonPhrase_1 = __importDefault(require("../utils/ReasonPhrase"));
class ErrorResponse extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
    }
}
/**
 * Conflict Request Error (409)
 */
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.CONFLICT, statusCode = HttpStatusCode_1.default.CONFLICT) {
        super(message, statusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
/**
 * Bad Request Error (400)
 */
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.BAD_REQUEST, statusCode = HttpStatusCode_1.default.BAD_REQUEST) {
        super(message, statusCode);
    }
}
exports.BadRequestError = BadRequestError;
/**
 * Authentication Failure Error (401)
 */
class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.UNAUTHORIZED, statusCode = HttpStatusCode_1.default.UNAUTHORIZED) {
        super(message, statusCode);
    }
}
exports.AuthFailureError = AuthFailureError;
/**
 * Not Found Error (404)
 */
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.NOT_FOUND, statusCode = HttpStatusCode_1.default.NOT_FOUND) {
        super(message, statusCode);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Forbidden Error (403)
 */
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.FORBIDDEN, statusCode = HttpStatusCode_1.default.FORBIDDEN) {
        super(message, statusCode);
    }
}
exports.ForbiddenError = ForbiddenError;
/**
 * Too Many Requests Error (429)
 */
class TooManyRequestsError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.TOO_MANY_REQUESTS, statusCode = HttpStatusCode_1.default.TOO_MANY_REQUESTS) {
        super(message, statusCode);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
/**
 * Internal Server Error (500)
 */
class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrase_1.default.INTERNAL_SERVER_ERROR, statusCode = HttpStatusCode_1.default.INTERNAL_SERVER_ERROR) {
        super(message, statusCode);
    }
}
exports.InternalServerError = InternalServerError;
