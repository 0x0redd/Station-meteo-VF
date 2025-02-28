import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'stationmeteo'
  });

  try {
    const [rows] = await connection.execute('SELECT * FROM et0 WHERE 1');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from database' });
  } finally {
    await connection.end();
  }
}