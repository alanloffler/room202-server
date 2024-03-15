import { Request, Response } from 'express';
import { PropertyModel } from '../models/property.model';
import { IProperty } from '../interfaces/property.interface';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { ResultSetHeader } from 'mysql2';
import { getByIdSchema, setActiveSchema, propertySchema } from '../libs/property.schema';
import { ZodError } from 'zod';
import { propertyIdSchema } from '../libs/property.schema';

export class PropertyController {
  static readonly error400Properties: IResponseStatus = { status: 400, message: '400 Bad Request | Products not found' };
  static readonly error400Property: IResponseStatus = { status: 400, message: '400 Bad Request | Product not found' };
  static readonly error400PropertyActive: IResponseStatus = { status: 400, message: '400 Bad Request | Property active status update failed' };
  static readonly error400PropertyCreate: IResponseStatus = { status: 400, message: '400 Bad Request | Property create failed' };
  static readonly error400PropertyUpdate: IResponseStatus = { status: 400, message: '400 Bad Request | Property update failed' };
  static readonly error400PropertyDelete: IResponseStatus = { status: 400, message: '400 Bad Request | Property delete failed' };
  static readonly error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };

  static readonly success200PropertyActive: IResponseStatus = { status: 200, message: '200 OK | Property active status updated successfully' };
  static readonly success200PropertyCreate: IResponseStatus = { status: 200, message: '200 OK | Property created successfully' };
  static readonly success200PropertyUpdate: IResponseStatus = { status: 200, message: '200 OK | Property updated successfully' };
  static readonly success200PropertyDelete: IResponseStatus = { status: 200, message: '200 OK | Property deleted successfully' };

  static async getAll(req: Request, res: Response): Promise<Response> {
    const properties: IProperty[] = await PropertyModel.getAll();
    if (properties.length < 1) return res.status(400).json(PropertyController.error400Properties);
    return res.json(properties);
  }

  static async getOne(req: Request, res: Response): Promise<Response> {
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

  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const validation = propertySchema.parse(data);
      const createProperty = await PropertyModel.create(data);
      if (createProperty.affectedRows < 1) return res.status(400).json(PropertyController.error400PropertyCreate);
      return res.status(200).json(PropertyController.success200PropertyCreate);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(PropertyController.error500);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      data.is_active === true ? (data.is_active = 1) : (data.is_active = 0);
      const validation = propertySchema.parse(data);
      const update = await PropertyModel.update(id, data);
      if (update.affectedRows < 1) return res.status(400).json(PropertyController.error400PropertyUpdate);
      return res.status(200).json(PropertyController.success200PropertyUpdate);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(PropertyController.error500);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const propertyId = Number(req.params.id);
      const validation = propertyIdSchema.parse({ id: propertyId });
      const deleteProperty = await PropertyModel.delete(propertyId);
      if (deleteProperty.affectedRows < 1) return res.status(400).json(PropertyController.error400PropertyDelete);
      return res.status(200).json(PropertyController.success200PropertyDelete);
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
}
