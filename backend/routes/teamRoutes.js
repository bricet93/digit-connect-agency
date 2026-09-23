import express from 'express';
import { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTeam);

router.post('/admin', verifyToken, createTeamMember);
router.put('/admin/:id', verifyToken, updateTeamMember);
router.delete('/admin/:id', verifyToken, deleteTeamMember);

export default router;