import { ResultSetHeader } from 'mysql2';
import pool from '../db';
import { IProperty } from '../interfaces/property.interface';

export class PropertyModel {
    static async getProperties(): Promise<IProperty[]> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM properties ORDER BY id DESC';
        const [rows] = await connection.query<IProperty[]>(sql);
        connection.release();
        return rows;
    }

    static async getProperty(id: number): Promise<IProperty> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM properties WHERE id=?';
        const [rows] = await connection.query<IProperty[]>(sql, [id]);
        connection.release();
        return rows[0];
    }
    // TODO ADD AND UPDATE
    static async deleteProperty(id: number): Promise<ResultSetHeader> {
        const connection = await pool.getConnection();
        const sql: string = 'DELETE FROM properties WHERE id=';
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

    static async update(id: number, data: IProperty): Promise<ResultSetHeader> {
        const connection = await pool.getConnection();
        const sql: string = 'UPDATE properties SET ? WHERE id=?';
        const [rows] = await connection.query<ResultSetHeader>(sql, [data, id]);
        connection.release();
        return rows;
    }
}