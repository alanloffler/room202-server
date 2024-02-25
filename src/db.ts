import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection: PoolOptions = {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    rowsAsArray: false,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 10
};

const pool: Pool = createPool(connection);

export default pool;
