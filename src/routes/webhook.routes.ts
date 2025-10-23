import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const webhookRouter = Router();

webhookRouter.post('/:instanceName', webhookController.handle);

export default webhookRouter;
