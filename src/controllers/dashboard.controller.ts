import { Request, Response } from 'express';
import { DashboardModel } from '../models/dashboard.model';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { IPropertiesByCategory } from '../interfaces/dashboard.interface';
import { idValidation } from '../libs/id.zod';
import { ZodError } from 'zod';

export class DashboardController {
  static readonly error400Total: IResponseStatus = { status: 400, message: '400 Bad Request | Impossible to count properties' };
  static readonly error400Category: IResponseStatus = { status: 400, message: '400 Bad Request | Impossible to recover properties' };
  static readonly error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };

  static async getTotalProperties(req: Request, res: Response): Promise<Response> {
    try {
      const totalProperties = await DashboardModel.getTotalProperties();
      if (totalProperties.length < 1) return res.status(400).json(DashboardController.error400Total);
      return res.status(200).json(totalProperties[0].total);
    } catch (error) {
      return res.status(500).json(DashboardController.error500);
    }
  }

  static async getPropertiesByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const propertiesByCategory: IPropertiesByCategory[] = await DashboardModel.getPropertiesByCategory();
      const totalProperties = await DashboardModel.getTotalProperties();
      if (propertiesByCategory.length < 1 || totalProperties.length < 1) return res.status(400).json(DashboardController.error400Category);
      propertiesByCategory.map(item => (item.percentage = (item.total * 100) / totalProperties[0].total));
      return res.status(200).json(propertiesByCategory);
    } catch (error) {
      return res.status(500).json(DashboardController.error500);
    }
  }

  static async getLatestProperties(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const validation = idValidation.parse({ id });
      const latestProperties = await DashboardModel.getLatestProperties(id);
      return res.status(200).json(latestProperties);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(DashboardController.error500);
    }
  }
}
