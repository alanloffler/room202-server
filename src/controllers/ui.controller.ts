import { Request, Response } from 'express';
import UIModel from '../models/ui.model';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { IUICombos } from '../interfaces/ui.interface';

const error400: IResponseStatus = { status: 400, message: '400 Bad Request | Business not found' };

export const getUIBusiness = async (req: Request, res: Response) => {
    const business = await UIModel.getBusiness();
    business.length < 1 ? res.json(error400) : res.json(business);
};

export const getUICategories = async (req: Request, res: Response) => {
    const categories: IUICombos[] = await UIModel.getCategories();
    categories.length < 1 ? res.json(error400) : res.json(categories);
};
