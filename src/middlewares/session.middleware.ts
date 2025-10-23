import { Response, NextFunction } from 'express';
import { SessionData } from '../helper/types';
import {
  isPublicRoute,
  isNewThirdPartyCall,
  finalizeRequest,
} from '../helper/session/route';
import {
  generateNewAuthToken,
  handleTokenError,
  verifyAuthToken,
} from '../helper/session/auth';

export async function sessionMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  if (isPublicRoute(req)) {
    next();
    return;
  }

  try {
    await handleAuthAndSession(req, res);
    next();
  } catch (error) {
    res.status(401).send(`Unauthorized: ${error.message}`);
  }
}

async function handleAuthAndSession(req: any, res: Response) {
  let authToken = req.cookies.token;
  let decoded: SessionData | undefined;

  try {
    if (isNewThirdPartyCall(req) || !authToken) {
      authToken = generateNewAuthToken(req.query);
    }
    decoded = verifyAuthToken(authToken) as SessionData;
  } catch (error) {
    authToken = handleTokenError(error, authToken);
  }
  await finalizeRequest(req, res, decoded!, authToken);
}
