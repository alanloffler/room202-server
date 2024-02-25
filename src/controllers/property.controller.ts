import { Request, Response } from 'express';
import PropertyModel from '../models/property.model';
import { IProperty } from '../interfaces/property.interface';
import { IError } from '../interfaces/error.interface';

const error204: IError = { status: 204, message: '204 No Content | No data found' };

export const getProperties = async (req: Request, res: Response) => {
    const { orderBy, orderType } = req.body;
    const properties: IProperty[] = await PropertyModel.getProperties();
    if (properties.length < 1) return res.json(error204);
    return res.json(properties);
};

export const getProperty = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const property: IProperty = await PropertyModel.getProperty(id);
    if (property === undefined) return res.json(error204);
    return res.json(property);
};
