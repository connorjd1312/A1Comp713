import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { AppError, isAppError } from '../errors.js';
import type { ApiError } from '../types.js';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found.'));
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const body: ApiError = isAppError(err)
    ? { code: err.code, message: err.message, path: req.originalUrl }
    : { code: 'INTERNAL_ERROR', message: 'Unexpected server error.', path: req.originalUrl };

  if (!isAppError(err)) {
    console.error(err);
  }

  res.status(isAppError(err) ? err.status : 500).json(body);
};
