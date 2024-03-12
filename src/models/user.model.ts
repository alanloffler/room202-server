import { ResultSetHeader, RowDataPacket } from 'mysql2';
import pool from '../db';
import { IUser } from '../interfaces/user.interface';

export class UserModel {
  static async getAll(): Promise<IUser[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT id, name, email, type, phone, created_at, updated_at FROM users';
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    const users = rows as IUser[];
    connection.release();
    return users;
  }

  static async getOne(id: number): Promise<IUser> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT * FROM users WHERE id=?';
    const [rows] = await connection.query<RowDataPacket[]>(sql, [id]);
    const user = rows[0] as IUser;
    connection.release();
    return user;
  }

  static async update(id: number, userData: IUser): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'UPDATE users SET ? WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [userData, id]);
    connection.release();
    return rows;
  }

  static async delete(id: number): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'DELETE FROM users WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [id]);
    connection.release();
    return rows;
  }

  static async emailOwnerChek(id: number, email: string): Promise<boolean> {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM users WHERE id=?', [id]);
    const tmp = rows[0] as IUser;
    connection.release();
    return email === tmp.email;
  }

  static async comparePassword(passwordReq: string, id: number): Promise<boolean> {
    const connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>('SELECT password FROM users WHERE id=?', [id]);
    const pass = rows[0];
    connection.release();
    return passwordReq === pass.password;
  }
}
