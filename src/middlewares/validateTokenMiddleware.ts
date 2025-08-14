import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { throwErrorMessage } from './errorHandlerMiddleware';

interface JWTPayload {
  id: number;
}
dotenv.config();

function validatetoken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    throw throwErrorMessage('unauthorized', 'Does not contain a valid token');
  }

  const validToken = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;

  res.locals.userId = validToken.id;

  next();
}

export { validatetoken };
