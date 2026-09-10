import dotenv from 'dotenv';
dotenv.config();

// Utilise la variable d'environnement ou une clé explicite par défaut
export const JWT_SECRET = process.env.JWT_SECRET || 'digit_connect_secret_key_2026';