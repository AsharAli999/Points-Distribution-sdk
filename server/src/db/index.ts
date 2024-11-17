import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log('Connecting to the database with the following settings:');
console.log({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD ? '****' : 'Not Provided',
  port: process.env.DB_PORT,
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err.message, err.stack);
});

(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Test query result:', res.rows[0]);
  } catch (err) {
    console.error('Database query failed:');
  }
})();

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
