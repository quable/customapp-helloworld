import { appService } from '../services/app.service';
import { Request, Response } from 'express';

class AppController {
  public renderConfigPage = async (req: any, res: Response) => {
    // Vérifier si l'instance existe
    if (!req.quableInstance) {
        return res.status(400).json({ 
            error: 'Unknown PIM instance',
            message: 'This PIM instance does not exist'
        });
    }
    
    try {
        const data = await appService.loadConfigPageData(req.quableInstance);
        return res.render('pages/index.ejs', { data });
    } catch (error) {
        console.error('Error loading config page:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'The configuration page could not be loaded'
        });
    }
};

  public launchSlot = async (req: Request, res: Response) => {
    const launchResponse = await appService.launchSlot(req);
    return res.status(launchResponse.statusCode).send(launchResponse);
  };
}

export const appController = new AppController();
