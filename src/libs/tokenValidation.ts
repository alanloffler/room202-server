import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../models/auth.model';
import { IResponseStatus } from 'interfaces/response-status.interface';

export interface IPayload {
    id: number;
    iat: number;
    exp: number;
}

const error401Denied: IResponseStatus = { status: 401, message: '401 Unauthorized | Access denied' };
const error401Expired: IResponseStatus = { status: 401, message: '401 Unauthorized | Access denied, token has expired' };

export const TokenValidation = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];
    if (!token) return res.status(401).json(error401Denied);

    const tokenExpired = await AuthModel.tokenExpired(token);
    if (tokenExpired) {
        return res.status(401).json(error401Expired);
    } else {
        const payload = jwt.verify(token, process.env.TOKEN_SECRET || 'tokenroom202') as IPayload;
        req.userId = payload.id;
        next();
    }
};
