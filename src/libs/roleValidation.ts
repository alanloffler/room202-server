import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user.model';
import { IResponseStatus } from '../interfaces/response-status.interface';

const error401Unauthorized: IResponseStatus = { status: 401, message: '401 Unauthorized | Access denied, you are not an admin' };

export const RoleValidation = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = Number(req.userId);
    const user = await UserModel.getUser(req.userId);

    if (user.type === 'admin') {
        return next();
    } else {
        return res.status(401).json(error401Unauthorized);
    }
};
