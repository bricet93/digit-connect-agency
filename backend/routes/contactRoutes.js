import express from 'express';
import { createContact, deleteContact } from '../controllers/contactController.js';
import pool from '../config/db.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public : Soumettre un message via le formulaire de contact
router.post('/', createContact);

// Admin : Récupérer tous les messages
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin : Supprimer un message
router.delete('/admin/:id', verifyToken, deleteContact);

export default router;