import { Request, Response } from 'express';
import { AuthModel } from '../models/auth.model';
import { IUser } from '../interfaces/user.interface';
import { IResponseStatus } from '../interfaces/response-status.interface';
import { loginSchema } from '../libs/login.schema';
import { ZodError } from 'zod';

export class AuthController {
  static errorCreation: IResponseStatus = { status: 400, message: '400 Bad Request | User not created' };
  static errorEmailRegistered: IResponseStatus = { status: 422, message: '422 Unprocessable Entity | Email already registered' };
  static errorUserNotFound: IResponseStatus = { status: 400, message: '400 Bad Request | User not found' };
  static errorPasswordNotMatch: IResponseStatus = { status: 400, message: '400 Bad Request | Password incorrect' };
  static error500: IResponseStatus = { status: 500, message: '500 Internal Server Error' };
  static success200: IResponseStatus = { status: 200, message: '200 OK | User created successfully' };

  static async signup(req: Request, res: Response): Promise<Response> {
    const emailUnique: boolean = await AuthModel.emailUniqueCheck(req.body.email);
    if (!emailUnique) return res.status(422).json(AuthController.errorEmailRegistered);

    const encryptedPassword: string = await AuthModel.encryptPassword(req.body.password);
    req.body.password = encryptedPassword;

    const newUser = await AuthModel.createUser(req.body);
    if (newUser[0].affectedRows < 1) return res.status(400).json(AuthController.errorCreation);

    const token: string = await AuthModel.generateToken(newUser[0].insertId);
    // Sent headers if signup is public to access app with token
    // res.header('auth-token', token).status(200).json({ message: '200 Ok | User created' });
    return res.status(200).json(AuthController.success200);
  }

  static async signin(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const zodValidation = loginSchema.parse({ email, password });
      const user: IUser = await AuthModel.getUserByEmail(email);

      if (user === undefined) {
        return res.status(400).json(AuthController.errorUserNotFound);
      } else {
        const validate: boolean = await AuthModel.validatePassword(password, user.password);
        if (!validate) return res.status(400).json(AuthController.errorPasswordNotMatch);

        const token: string = await AuthModel.generateToken(user.id);
        return res.header('auth-token', token).json({ token: token, userId: user.id });
      }
    } catch (error) {
      if (error instanceof ZodError) return res.status(400).json({ status: 400, message: error.name + ' | Error on validation', error: error.issues });
      return res.status(500).json(AuthController.error500);
    }
  }
}
