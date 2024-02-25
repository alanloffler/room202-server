import pool from '../db';
import { IUICombos } from '../interfaces/ui.interface';

class UIModel {
    async getBusiness(): Promise<IUICombos[]> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM ui_business ORDER BY name ASC';
        const [rows] = await connection.query<IUICombos[]>(sql);
        connection.release();
        return rows;
    }

    async getCategories(): Promise<IUICombos[]> {
        const connection = await pool.getConnection();
        const sql: string = 'SELECT * FROM ui_categories ORDER BY name ASC';
        const [rows] = await connection.query<IUICombos[]>(sql);
        connection.release();
        return rows;
    }
}

export default new UIModel();
