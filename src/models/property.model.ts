import { ResultSetHeader } from 'mysql2';
import pool from '../db';
import { IProperty } from '../interfaces/property.interface';

class PropertyModel {
    async getProperties(): Promise<IProperty[]> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM properties ORDER BY id DESC';
        const [rows] = await connection.query<IProperty[]>(sql);
        connection.release();
        return rows;
    }

    async getProperty(id: number): Promise<IProperty> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM properties WHERE id=?';
        const [rows] = await connection.query<IProperty[]>(sql, [id]);
        connection.release();
        return rows[0];
    }
    // TODO ADD AND UPDATE
    async deleteProperty(id: number): Promise<ResultSetHeader> {
        const connection = await pool.getConnection();
        const sql: string = 'DELETE FROM properties WHERE id=';
        const [rows] = await connection.query<ResultSetHeader>(sql, [id]);
        connection.release();
        return rows;
    }
}

export default new PropertyModel();
