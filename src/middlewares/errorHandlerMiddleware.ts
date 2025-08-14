import { NextFunction, Request, Response } from 'express';

import { IErrors } from '../interfaces/errorsInterface';
import { ERRORS, ErrorsTypes } from '../types/errorsType';

interface CustomError extends Error {
  type: ErrorsTypes;
  error_message: string | string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err: IErrors, _req: Request, res: Response, _next: NextFunction) {
  const { type, error_message } = err;
  const statusCode = ERRORS[type];

  if (statusCode) {
    return res.status(statusCode).send(error_message);
  }
  return res.status(500).send(err.message);
}

function throwErrorMessage(type: ErrorsTypes, error_message: string | string[]) {
  const error = new Error() as CustomError;
  error.type = type;
  error.error_message = error_message;
  throw error;
}

export { errorHandler, throwErrorMessage };
