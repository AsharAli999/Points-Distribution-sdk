import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate validation (needed for Render)
  },
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
    console.error('Database query failed:'); // Improved error logging
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
