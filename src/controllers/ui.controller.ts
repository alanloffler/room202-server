import { Request, Response } from 'express';
import UIModel from '../models/ui.model';
import { IError } from '../interfaces/error.interface';
import { IUICombos } from '../interfaces/ui.interface';

const error204: IError = { status: 204, message: '204 No Content | No data found' };

export const getUIBusiness = async (req: Request, res: Response) => {
    const business = await UIModel.getBusiness();
    business.length < 1 ? res.json(error204) : res.json(business);
};

export const getUICategories = async (req: Request, res: Response) => {
    const categories: IUICombos[] = await UIModel.getCategories();
    categories.length < 1 ? res.json(error204) : res.json(categories);
};
