import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez saisir un email et un mot de passe.' });
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (rows.length === 0 || rows[0].password_hash !== password) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    const admin = rows[0];

    // Signature avec la clé centralisée
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET || 'votre_cle_secrete', { expiresIn: '1d' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};