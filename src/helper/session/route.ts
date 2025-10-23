import { databaseService } from 'src/services/database.service';
import { Response } from 'express';
import { SessionData, CustomRequest } from '../types';

const unProtectedRoutes = [
  '/install',
  '/uninstall',
  '/permission',
  '/webhook',
];

export const isPublicRoute = (req: CustomRequest) => {
  const isOldThirdPartyCall =
    req.path === '/' &&
    req.method === 'POST' &&
    req.app?.settings?.application_type === 'document';

  const isUnprotectedRoute = unProtectedRoutes.some((route) => {
    const pattern = new RegExp(`^${route}(/|$|\\?)`);
    return pattern.test(req.path);
  });

  const isAnAsset = /\.\w+(\?.*)?$/.test(req.url);

  return isOldThirdPartyCall || isUnprotectedRoute || isAnAsset;
};

export function isNewThirdPartyCall(req: CustomRequest) {
  return (
    req.path === '/' &&
    req.method === 'GET' &&
    req.query.quableInstanceName &&
    req.query.dataLocale &&
    req.query.interfaceLocale &&
    req.query.userId
  );
}

export async function validateQuableInstance(customerName: string) {
  const quableInstance = await getAppInstanceByName(customerName);
  if (!quableInstance) {
    throw new Error(
      `The Quable instance ${customerName} is not installed on this application. Please consider using '/install' to install the application.`,
    );
  }
  return quableInstance;
}

export async function getAppInstanceByName(name: string) {
  try {
    return await databaseService.quableInstance.findFirstOrThrow({
      where: { name },
    });
  } catch (_) {
    return null;
  }
}

export async function finalizeRequest(
  req: CustomRequest,
  res: Response,
  decodedSession: SessionData,
  authToken: string,
) {
  const quableInstance = await validateQuableInstance(
    decodedSession.quableInstanceName,
  );

  const customerName = req.path.split('/')[1];
  if (
    req.path !== '/' &&
    (!customerName || decodedSession.quableInstanceName !== customerName)
  ) {
    throw new Error(
      'Bad request: The customer was not found or does not match this cookie signature.',
    );
  }
  req.customer = decodedSession.quableInstanceName;
  req.quableInstance = quableInstance;
  res.locals.customer = decodedSession.quableInstanceName;
  res.locals.interfaceLocale = decodedSession.interfaceLocale;
  res.locals.dataLocale = decodedSession.dataLocale;
  setResponseCookie(res, authToken);
}

export function setResponseCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
}
