import express from 'express';
import { 
  getPublicArticles, 
  getArticleBySlug, 
  getAdminArticles, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from '../controllers/articleController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPublicArticles);
router.get('/:slug', getArticleBySlug);

router.get('/admin/all', verifyToken, getAdminArticles);
router.post('/admin', verifyToken, createArticle);
router.put('/admin/:id', verifyToken, updateArticle);
router.delete('/admin/:id', verifyToken, deleteArticle);

export default router;