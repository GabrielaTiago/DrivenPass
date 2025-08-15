import { NextFunction, Request, Response } from 'express';

import { throwErrorMessage } from './errorHandlerMiddleware';
import { verifyToken } from '../utils/token';

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  const token = authorization?.replace('Bearer ', '');
  if (!token) throw throwErrorMessage('unauthorized', 'Token JWT not sent');

  const validToken = verifyToken(token);
  if (!validToken) throw throwErrorMessage('unauthorized', 'Invalid or expired token');
  res.locals.userId = validToken.id;

  next();
}
