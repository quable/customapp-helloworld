import { appController } from '../controllers/app.controller';
import { Router } from 'express';

const appRouter = Router();

appRouter.get('/', appController.renderConfigPage);

appRouter.post('/', appController.launchSlot);


export default appRouter;
