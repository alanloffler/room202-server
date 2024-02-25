import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import AuthModel from '../models/auth.model';
import UserModel from '../models/user.model';
import IUser from '../interfaces/user.interface';
import { IError } from '../interfaces/error.interface';

const error400UserNotFound: IError = { status: 400, message: '400 Bad Request | User not found' };
const error400UserNotUpdated: IError = { status: 400, message: '400 Bad Request | User not updated' };
const error400UserNotDeleted: IError = { status: 400, message: '400 Bad Request | User not deleted' };
const error400UsersNotFound: IError = { status: 400, message: '400 Bad Request | Users not found' };
const errorEmailRegistered: IError = { status: 422, message: '422 Unprocessable Entity | Email already registered' };
const success200UserUpdated: IError = { status: 200, message: '200 OK | User updated' };
const success200UserDeleted: IError = { status: 200, message: '200 OK | User deleted' };

export const getUsers = async (req: Request, res: Response) => {
    //console.log('User:', req.userId);
    const users: IUser[] = await UserModel.getUsers();
    if (!users) res.status(400).json(error400UsersNotFound);
    res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
    const user: IUser = await UserModel.getUser(Number(req.params.id));
    if (!user) res.status(400).json(error400UserNotFound);
    res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
    const user = { ...req.body };
    const emailUnique: boolean = await AuthModel.emailUniqueCheck(user.email);
    const comparePassword: boolean = await UserModel.comparePassword(user.password, Number(req.params.id));

    if (comparePassword) {
        delete user.password;
    } else {
        const encryptedPassword: string = await AuthModel.encryptPassword(req.body.password);
        user.password = encryptedPassword;
    }
    if (emailUnique) {
        const updateUser: ResultSetHeader = await UserModel.updateUser(Number(req.params.id), user);
        if (!updateUser.affectedRows) res.status(400).json(error400UserNotUpdated);
        res.status(200).json(success200UserUpdated);
    } else {
        const emailOwner: boolean = await UserModel.emailOwnerChek(Number(req.params.id), user.email);
        if (emailOwner) {
            delete user.email;
            const updateUser: ResultSetHeader = await UserModel.updateUser(Number(req.params.id), user);
            if (!updateUser.affectedRows) res.status(400).json(error400UserNotUpdated);
            res.status(200).json(success200UserUpdated);
        } else {
            return res.status(422).json(errorEmailRegistered);
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const deleteUser = await UserModel.deleteUser(Number(req.params.id));
    if (deleteUser.affectedRows < 1) res.status(400).json(error400UserNotDeleted);
    res.json(success200UserDeleted);
};
