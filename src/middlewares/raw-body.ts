import { Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';


export function rawBody(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    bodyParser.json({
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf;
        (req as any).rawBodyString = buf.toString('utf8');
      },
    })(req, res, next);
  };
}

