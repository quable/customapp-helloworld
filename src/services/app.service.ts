import { webhookService } from './webhook.service';
import { QuableInstance } from '@prisma/client';
import { keyValueService } from './keyvalue.service';
import { databaseService } from './database.service';
import { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

class AppService {

  public launchSlot = async (req: Request) => {
    const response = { statusCode: 200, message: 'OK', url: '', err: 0 };
    try {
      const { instance, slot, data } = req.body;
      const quableInstance = await databaseService.quableInstance.findFirst({
        where: { name: instance },
      });

      if (!quableInstance) {
        return { statusCode: 400, message: 'Quable instance not found', err: 1, url: '' };
      }

      const isValidHmac = this.validateHmac(req, quableInstance.quableAppSecret);
      if (!isValidHmac) {
        return { statusCode: 400, message: 'Invalid signature', err: 1, url: '' };
      }

      const { dataLocale, interfaceLocale, userId } = data;
      response.url = `${process.env.QUABLE_APP_HOST_URL}/slot/${slot}?quableInstanceName=${instance}&dataLocale=${dataLocale}&interfaceLocale=${interfaceLocale}&userId=${userId}`;
    } catch (error) {
      console.log(error);
      response.statusCode = 500;
      response.message = error.message;
      response.err = 1;
    }

    return response;
  };

  public loadConfigPageData = async (instance: QuableInstance) => {
    try {
      const [webhook, keyValue] = await Promise.all([
        webhookService.registerWebhook(instance),
        keyValueService.registerKeyValue(instance),
      ]);
      return { webhook, keyValue };
    } catch (error) {
      console.log(error);
      return;
    }
  };

  private validateHmac = (req: Request, secret: string) => {
    const method = req.method.toUpperCase();
    const hostUrl = process.env.QUABLE_APP_HOST_URL?.replace(/\/$/, '') || '';
    const pathWithQuery = req.originalUrl.replace(/\/(?=\?)/, '');
    const endpoint = `${hostUrl}${pathWithQuery}`;
    const timestamp = req.headers['x-timestamp'];
    const payload = req.rawBody?.toString('utf-8') || '';

    const stringToSign = [method, endpoint, timestamp, payload].join('|');

    const hmac = createHmac('SHA256', secret)
      .update(stringToSign)
      .digest();

    const expected = Buffer.from(hmac.toString('base64'));
    const receivedSignature = req.headers['x-signature'];
    if (typeof receivedSignature !== 'string') {
      return false;
    }
    const received = Buffer.from(receivedSignature);

    // timingSafeEqual throws on length mismatch: reject explicitly instead of returning a 500.
    return received.length === expected.length && timingSafeEqual(expected, received);
  };
}

export const appService = new AppService();
