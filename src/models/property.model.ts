import { ResultSetHeader } from 'mysql2';
import pool from '../db';
import { IProperty } from '../interfaces/property.interface';

export class PropertyModel {
  static async getAll(): Promise<IProperty[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT * FROM properties ORDER BY id DESC';
    const [rows] = await connection.query<IProperty[]>(sql);
    connection.release();
    return rows;
  }

  static async getOne(id: number): Promise<IProperty> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT * FROM properties WHERE id=?';
    const [rows] = await connection.query<IProperty[]>(sql, [id]);
    connection.release();
    return rows[0];
  }

  static async create(data: object): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'INSERT INTO properties SET ?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [data]);
    connection.release();
    return rows;
  }

  static async update(id: number, data: IProperty): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'UPDATE properties SET ? WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [data, id]);
    connection.release();
    return rows;
  }

  static async delete(id: number): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'DELETE FROM properties WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [id]);
    connection.release();
    return rows;
  }
  
  static async setActive(id: number, active: boolean): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'UPDATE properties SET is_active=? WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [active, id]);
    connection.release();
    return rows;
  }
}
