import HTTP_STATUS_CODE from "http-status-codes";

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeErrors(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class BadRequestError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.BAD_REQUEST;

  constructor(public message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.UNAUTHORIZED;

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.REQUEST_TOO_LONG;

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.SERVICE_UNAVAILABLE;

  constructor(message: string) {
    super(message);
  }
}

export class JoiRequestValidationError extends CustomError {
  status = "error";
  statusCode: number = HTTP_STATUS_CODE.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

export class DatabaseConnectionError extends CustomError {
  status = "error";
  statusCode = HTTP_STATUS_CODE.SERVICE_UNAVAILABLE;

  constructor(message: string) {
    super(message);
  }
}
