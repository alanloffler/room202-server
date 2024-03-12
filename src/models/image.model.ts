import pool from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ImageModel {
  static async getById({ id }: { id: number }): Promise<RowDataPacket[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT * FROM images WHERE propertyId=?';
    const [rows] = await connection.query<RowDataPacket[]>(sql, [id]);
    connection.release();
    return rows;
  }

  static async create({ id, name }: { id: number, name: string }): Promise<ResultSetHeader[]> {
    const connection = await pool.getConnection();
    const sql: string = 'INSERT INTO images (name, propertyId) VALUES (?, ?)';
    const [rows] = await connection.query<ResultSetHeader[]>(sql, [name, id]);
    connection.release();
    return Object.values(JSON.parse(JSON.stringify(rows))) as ResultSetHeader[];
  }

  static async delete({ id }: { id: number }): Promise<ResultSetHeader> {
    const connection = await pool.getConnection();
    const sql: string = 'DELETE FROM images WHERE id=?';
    const [rows] = await connection.query<ResultSetHeader>(sql, [id]);
    connection.release();
    return rows;
  }
}
