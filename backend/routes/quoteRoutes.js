import express from 'express';
import { createQuote, downloadQuotePDF, deleteQuote, getAllQuotes } from '../controllers/quoteController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public : Génération par l'utilisateur
router.post('/', createQuote);

// Admin : Récupération et suppression
router.get('/admin/all', verifyToken, getAllQuotes);
router.delete('/admin/:id', verifyToken, deleteQuote);

// Public / Client : Téléchargement du PDF via Code unique
router.get('/:code/pdf', downloadQuotePDF);

export default router;