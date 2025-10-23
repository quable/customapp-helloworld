import { Response } from 'express';
import { webhookService } from '../services/webhook.service';

class WebhookController {
    public handle = async (_req: any, res: Response) => {
        const { instanceName } = _req.params ?? {};
        webhookService.processWebhook(instanceName, _req.body);
        res.status(200).send('Webhook received');
    };
}

export const webhookController = new WebhookController();