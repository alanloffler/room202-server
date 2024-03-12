import { Request, Response } from 'express';
import { PropertyModel } from '../models/property.model';
import { IProperty } from '../interfaces/property.interface';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { ResultSetHeader } from 'mysql2';
import { getByIdSchema, setActiveSchema, updateSchema } from '../libs/property.schemas';
import { ZodError } from 'zod';

export class PropertyController {
  static readonly error400Properties: IResponseStatus = { status: 400, message: '400 Bad Request | Products not found' };
  static readonly error400Property: IResponseStatus = { status: 400, message: '400 Bad Request | Product not found' };
  static readonly error400PropertyActive: IResponseStatus = { status: 400, message: '400 Bad Request | Property active status update failed' };
  static readonly error400PropertyUpdate: IResponseStatus = { status: 400, message: '400 Bad Request | Property update failed' };
  static readonly error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };

  static readonly success200PropertyActive: IResponseStatus = { status: 200, message: '200 OK | Property active status updated successfully' };
  static readonly success200PropertyUpdate: IResponseStatus = { status: 200, message: '200 OK | Property updated successfully' };

  static async getAll(req: Request, res: Response): Promise<Response> {
    const properties: IProperty[] = await PropertyModel.getAll();
    if (properties.length < 1) return res.status(400).json(PropertyController.error400Properties);
    return res.json(properties);
  }

  static async getById(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const validation = getByIdSchema.parse({ id });
      const property: IProperty = await PropertyModel.getOne(id);
      if (property === undefined) return res.status(400).json(PropertyController.error400Property);
      return res.status(200).json(property);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(PropertyController.error500);
    }
  }

  static async setActive(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const active = req.body.active;
      const validation = setActiveSchema.parse({ id, active });
      const setActive: ResultSetHeader = await PropertyModel.setActive(id, active);
      if (setActive.affectedRows < 1) return res.status(400).json(PropertyController.error400PropertyActive);
      return res.status(200).json(PropertyController.success200PropertyActive);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(PropertyController.error500);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const validation = updateSchema.parse(data);
      const update = await PropertyModel.update(id, data);
      console.log(update);
      if (update.affectedRows < 1) return res.status(400).json(PropertyController.error400PropertyUpdate);
      return res.status(200).json(PropertyController.success200PropertyUpdate);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(PropertyController.error500);
    }
  }
}
