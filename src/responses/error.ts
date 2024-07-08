import HttpStatusCode from "~/enums/HttpStatusCode";
import ReasonPhrase from "~/enums/ReasonPhrase";

class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

/**
 * Conflict Request Error (409)
 */
class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.CONFLICT, statusCode: number = HttpStatusCode.CONFLICT) {
    super(message, statusCode);
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.BAD_REQUEST, statusCode: number = HttpStatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

/**
 * Authentication Failure Error (401)
 */
class AuthFailureError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.UNAUTHORIZED, statusCode: number = HttpStatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.NOT_FOUND, statusCode: number = HttpStatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.FORBIDDEN, statusCode: number = HttpStatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

/**
 * Too Many Requests Error (429)
 */
class TooManyRequestsError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.TOO_MANY_REQUESTS, statusCode: number = HttpStatusCode.TOO_MANY_REQUESTS) {
    super(message, statusCode);
  }
}

/**
 * Internal Server Error (500)
 */
class InternalServerError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrase.INTERNAL_SERVER_ERROR,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  TooManyRequestsError,
  InternalServerError,
};
