import HttpStatusCode from "~/utils/HttpStatusCode";
import ReasonPhrase from "~/utils/ReasonPhrase";

class ErrorResponse extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.CONFLICT, statusCode: number = HttpStatusCode.CONFLICT) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.BAD_REQUEST, statusCode: number = HttpStatusCode.BAD_REQUEST) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.UNAUTHORIZED, statusCode: number = HttpStatusCode.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.NOT_FOUND, statusCode: number = HttpStatusCode.NOT_FOUND) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.FORBIDDEN, statusCode: number = HttpStatusCode.FORBIDDEN) {
    super(message, statusCode);
  }
}

class ToManyRequestsError extends ErrorResponse {
  constructor(message: string = ReasonPhrase.TOO_MANY_REQUESTS, statusCode: number = HttpStatusCode.TOO_MANY_REQUESTS) {
    super(message, statusCode);
  }
}

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
  ToManyRequestsError,
  InternalServerError,
};
