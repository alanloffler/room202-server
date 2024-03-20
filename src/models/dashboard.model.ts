import { RowDataPacket } from 'mysql2';
import pool from '../db';

interface IPropertiesByCategory extends RowDataPacket {
  category: string;
  total: number;
  color: string;
  percentage: number;
}

export class DashboardModel {
  static async getTotalProperties(): Promise<RowDataPacket[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT COUNT(*) AS total FROM properties';
    const [rows] = await connection.query<RowDataPacket[]>(sql);
    connection.release();
    return rows;
  }

  static async getPropertiesByCategory(): Promise<IPropertiesByCategory[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT type AS category, COUNT(*) AS total, color AS color FROM properties GROUP BY type, color';
    const [rows] = await connection.query<IPropertiesByCategory[]>(sql);
    connection.release();
    return rows;
  }

  static async getLatestProperties(id: number): Promise<RowDataPacket[]> {
    const connection = await pool.getConnection();
    const sql: string = 'SELECT * FROM properties ORDER BY id DESC LIMIT ?';
    const [rows] = await connection.query<RowDataPacket[]>(sql, [id]);
    connection.release();
    return rows;
  }
}
