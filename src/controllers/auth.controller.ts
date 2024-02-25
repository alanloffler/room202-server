import { Request, Response } from 'express';
import AuthModel from '../models/auth.model';
import IUser from '../interfaces/user.interface';
import RowData from '../interfaces/mysql.interface';
import { IError } from '../interfaces/error.interface';

const errorCreation: IError = { status: 400, message: '400 Bad Request | User not created' };
const errorEmailRegistered: IError = { status: 422, message: '422 Unprocessable Entity | Email already registered' };
const errorUserNotFound: IError = { status: 400, message: '400 Bad Request | User not found' };
const errorPasswordNotMatch: IError = { status: 400, message: '400 Bad Request | Password incorrect' };

export const signup = async (req: Request, res: Response) => {
    const emailUnique: boolean = await AuthModel.emailUniqueCheck(req.body.email);
    if (!emailUnique) return res.status(422).json(errorEmailRegistered);

    const encryptedPassword: string = await AuthModel.encryptPassword(req.body.password);
    req.body.password = encryptedPassword;

    const newUser: RowData[] = await AuthModel.createUser(req.body);
    if (newUser[0].affectedRows < 1) return res.status(400).json(errorCreation);

    const token: string = await AuthModel.generateToken(newUser[0].insertId);
    // Sent headers if signup is public to access app with token
    // res.header('auth-token', token).status(200).json({ message: '200 Ok | User created' });
    res.json({ status: 200, message: '200 Ok | User created' });
};

export const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user: IUser = await AuthModel.getUserByEmail(email);

    if (user === undefined) {
        return res.status(400).json(errorUserNotFound);
    } else {
        const validate: boolean = await AuthModel.validatePassword(password, user.password);
        if (!validate) return res.status(400).json(errorPasswordNotMatch);

        const token: string = await AuthModel.generateToken(user.id);
        res.header('auth-token', token).json({ token: token, userId: user.id });
    }
};
