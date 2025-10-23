import { Router } from 'express';
import { slotController } from '../controllers/slot.controller';

const slotRouter = Router();

slotRouter.get('/:slot', slotController.handle);

export default slotRouter;
