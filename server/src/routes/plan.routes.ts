import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  getAllPlans, 
  getPlanById, 
  createPlan, 
  updatePlan, 
  deletePlan 
} from '../controllers/plan.controller';

const router = express.Router();

// Public routes
router.get('/', authenticate, getAllPlans);
router.get('/:id', authenticate, getPlanById);

// Protected routes
router.post('/', authenticate, authorize(['admin', 'manager']), createPlan);
router.put('/:id', authenticate, authorize(['admin', 'manager']), updatePlan);
router.delete('/:id', authenticate, authorize(['admin']), deletePlan);

export default router;
