import { Response, NextFunction } from 'express';
import morgan from 'morgan';

export function httpLoggerMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  morgan.token('instance', (req: any) =>
    req.customer ? `[${req.customer}]` : '',
  );

  const logFormat = ':instance :method :url :status :response-time ms (:date[iso])';

  const excludeRoutePattern = /\.\w+(\?.*)?$/;

  if (!excludeRoutePattern.test(req.url)) {
    morgan(logFormat)(req, res, next);
  } else {
    next();
  }
}
