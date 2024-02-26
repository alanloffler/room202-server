import { Request, Response } from 'express';
import PropertyModel from '../models/property.model';
import { IProperty } from '../interfaces/property.interface';
import { IError } from '../interfaces/error.interface';

const error400Products: IError = { status: 400, message: '400 Bad Request | Products not found' };
const error400Product: IError = { status: 400, message: '400 Bad Request | Product not found' };

export const getProperties = async (req: Request, res: Response) => {
    const { orderBy, orderType } = req.body;
    const properties: IProperty[] = await PropertyModel.getProperties();
    if (properties.length < 1) return res.status(400).json(error400Products);
    return res.json(properties);
};

export const getProperty = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const property: IProperty = await PropertyModel.getProperty(id);
    if (property === undefined) return res.status(400).json(error400Product);
    return res.json(property);
};
