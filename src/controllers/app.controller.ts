import { appService } from '../services/app.service';
import { Request, Response } from 'express';

class AppController {
  public renderConfigPage = async (req: any, res: Response) => {
    const data = await appService.loadConfigPageData(req.quableInstance);
    return res.render('pages/index.ejs', { data });
  };

  public launchSlot = async (req: Request, res: Response) => {
    const launchResponse = await appService.launchSlot(req);
    return res.status(launchResponse.statusCode).send(launchResponse);
  };
}

export const appController = new AppController();
