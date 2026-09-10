import express from 'express';
import { getPortfolio, getAllAdminPortfolio, createPortfolio, updatePortfolio, deletePortfolio } from '../controllers/portfolioController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPortfolio);

router.get('/admin/all', verifyToken, getAllAdminPortfolio);
router.post('/admin', verifyToken, createPortfolio);
router.put('/admin/:id', verifyToken, updatePortfolio);
router.delete('/admin/:id', verifyToken, deletePortfolio);

export default router;