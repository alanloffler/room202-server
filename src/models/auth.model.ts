import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IUser from '../interfaces/user.interface';

interface DecodedToken {
    payload: {
        exp?: number;
    } | null;
}

class AuthModel {
    async createUser(userData: IUser) {
        const user = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            type: userData.type,
            phone: userData.phone
        };
        const connection = await pool.getConnection();
        const rows = await connection.query<ResultSetHeader[]>('INSERT INTO users SET ?', [user]);
        const obj: any = Object.values(JSON.parse(JSON.stringify(rows)));
        connection.release();
        return obj;
    }

    async getUserByEmail(email: string): Promise<IUser> {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM users WHERE email=?', [email]);
        const user = rows[0] as IUser;
        connection.release();
        return user;
    }

    async emailUniqueCheck(email: string): Promise<boolean> {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT * FROM users WHERE email=?', [email]);
        connection.release();
        return rows.length < 1;
    }

    async validatePassword(passwordReq: string, passwordDb: string): Promise<boolean> {
        return bcrypt.compare(passwordReq, passwordDb);
    }

    async encryptPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async generateToken(id: number | undefined): Promise<string> {
        return jwt.sign({ id: id }, process.env.TOKEN_SECRET || 'tokenroom202', { expiresIn: 60 * 60 * 24 });
    }

    async tokenExpired(token: string): Promise<boolean> {
        const decoded = jwt.decode(token, { complete: true }) as DecodedToken;

        if (!decoded || !decoded.payload || !decoded.payload.exp) return false;

        const expirationTime = decoded.payload.exp * 1000;
        const currentTime = new Date().getTime();

        return currentTime > expirationTime;
    }
}

export default new AuthModel();
