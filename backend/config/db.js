import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'digit_connect_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion rapide
try {
  const connection = await pool.getConnection();
  console.log('✅ BD MySQL connectée avec succès !');
  connection.release();
} catch (error) {
  console.error('❌ Erreur de connexion à MySQL :', error.message);
}

export default pool;