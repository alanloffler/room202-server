import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import { AuthModel } from '../models/auth.model';
import { UserModel } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { userIdSchema, userSchema } from '../libs/user.schema';
import { ZodError } from 'zod';

export class UserController {
  static readonly error400UserNotFound: IResponseStatus = { status: 400, message: '400 Bad Request | User not found' };
  static readonly error400UserNotUpdated: IResponseStatus = { status: 400, message: '400 Bad Request | User not updated' };
  static readonly error400UserNotDeleted: IResponseStatus = { status: 400, message: '400 Bad Request | User not deleted' };
  static readonly error400UsersNotFound: IResponseStatus = { status: 400, message: '400 Bad Request | Users not found' };
  static readonly errorEmailRegistered: IResponseStatus = { status: 422, message: '422 Unprocessable Entity | Email already registered' };
  static readonly error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };
  static readonly success200UserUpdated: IResponseStatus = { status: 200, message: '200 OK | User updated' };
  static readonly success200UserDeleted: IResponseStatus = { status: 200, message: '200 OK | User deleted' };

  static async getAll(req: Request, res: Response): Promise<Response> {
    //console.log('User:', req.userId);
    try {
      const users: IUser[] = await UserModel.getAll();
      if (!users) return res.status(400).json(UserController.error400UsersNotFound);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(UserController.error500);
    }
  }

  static async getOne(req: Request, res: Response): Promise<Response> {
    try {
      const userId: number = Number(req.params.id);
      const userIdValidation = userIdSchema.parse({ id: userId });
      const user: IUser = await UserModel.getOne(userId);
      if (!user) return res.status(400).json(UserController.error400UserNotFound);
      return res.status(200).json(user);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(UserController.error500);
    }
  }

  static async update(req: Request, res: Response): Promise<Response> {
    try {
      const user = { ...req.body };
      const userValidation = userSchema.parse(user);
      const emailUnique: boolean = await AuthModel.emailUniqueCheck(user.email);
      const comparePassword: boolean = await UserModel.comparePassword(user.password, Number(req.params.id));

      if (comparePassword) {
        delete user.password;
      } else {
        const encryptedPassword: string = await AuthModel.encryptPassword(req.body.password);
        user.password = encryptedPassword;
      }
      if (emailUnique) {
        const updateUser: ResultSetHeader = await UserModel.update(Number(req.params.id), user);
        if (!updateUser.affectedRows) return res.status(400).json(UserController.error400UserNotUpdated);
        return res.status(200).json(UserController.success200UserUpdated);
      } else {
        const emailOwner: boolean = await UserModel.emailOwnerChek(Number(req.params.id), user.email);
        if (emailOwner) {
          delete user.email;
          const updateUser: ResultSetHeader = await UserModel.update(Number(req.params.id), user);
          if (!updateUser.affectedRows) return res.status(400).json(UserController.error400UserNotUpdated);
          return res.status(200).json(UserController.success200UserUpdated);
        } else {
          return res.status(422).json(UserController.errorEmailRegistered);
        }
      }
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(UserController.error500);
    }
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    try {
      const userId: number = Number(req.params.id);
      const userIdValidation = userIdSchema.parse({ id: userId });
      const deleteUser = await UserModel.delete(userId);
      if (deleteUser.affectedRows < 1) return res.status(400).json(UserController.error400UserNotDeleted);
      return res.status(200).json(UserController.success200UserDeleted);
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(UserController.error500);
    }
  }
}
