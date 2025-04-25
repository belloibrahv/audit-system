import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  getAllFindings, 
  getFindingById, 
  createFinding, 
  updateFinding, 
  deleteFinding,
  createRecommendation,
  updateRecommendation
} from '../controllers/finding.controller';

const router = express.Router();

// Protected routes
router.get('/', authenticate, getAllFindings);
router.get('/:id', authenticate, getFindingById);
router.post('/', authenticate, authorize(['admin', 'manager', 'lead', 'member']), createFinding);
router.put('/:id', authenticate, authorize(['admin', 'manager', 'lead', 'member']), updateFinding);
router.delete('/:id', authenticate, authorize(['admin', 'lead']), deleteFinding);

// Recommendation routes
router.post('/:id/recommendations', authenticate, createRecommendation);
router.put('/recommendations/:id', authenticate, updateRecommendation);

export default router;
