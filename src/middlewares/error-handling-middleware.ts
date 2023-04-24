import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApplicationError } from '@/protocols';

interface ErrorMapping {
  [key: string]: number;
}

const errorMapping: ErrorMapping = {
  CannotEnrollBeforeStartDateError: httpStatus.BAD_REQUEST,
  ConflictError: httpStatus.CONFLICT,
  DuplicatedEmailError: httpStatus.CONFLICT,
  InvalidCredentialsError: httpStatus.UNAUTHORIZED,
  UnauthorizedError: httpStatus.UNAUTHORIZED,
  NotFoundError: httpStatus.NOT_FOUND,
  InvalidCEPError: httpStatus.BAD_REQUEST,
};

export function handleApplicationErrors(
  err: ApplicationError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = errorMapping[err.name];

  if (status) {
    return res.status(status).send({
      message: err.message,
    });
  }

  /* eslint-disable-next-line no-console */
  console.error(err.name);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}
