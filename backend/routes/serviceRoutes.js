import express from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/serviceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public : Utilisé par le générateur de devis
router.get('/', getServices);

// Admin : Protégés par jeton JWT
router.post('/admin', verifyToken, createService);
router.put('/admin/:id', verifyToken, updateService);
router.delete('/admin/:id', verifyToken, deleteService);

export default router;