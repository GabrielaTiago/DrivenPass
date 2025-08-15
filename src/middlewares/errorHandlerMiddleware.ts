import { NextFunction, Request, Response } from 'express';

import { IErrors } from '../interfaces/errorsInterface';
import { ERRORS, ErrorsTypes } from '../types/errorsType';

interface CustomError extends Error {
  type: ErrorsTypes;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: IErrors, _req: Request, res: Response, _next: NextFunction) {
  const { type, message } = err;
  const statusCode = ERRORS[type];

  if (statusCode) {
    return res.status(statusCode).send({ message });
  }
  return res.status(ERRORS.internal_server_error).send(err.message);
}

function throwErrorMessage(type: ErrorsTypes, message: string) {
  const error = new Error() as CustomError;
  error.type = type;
  error.message = message;
  throw error;
}

export { errorHandler, throwErrorMessage };
