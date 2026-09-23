import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔴 Middleware Error: Header Authorization absent ou mal formé');
    return res.status(401).json({ success: false, message: 'Accès refusé : Token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.log('🔴 Middleware Error: Échec de vérification du Token ->', error.message);
    return res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
};