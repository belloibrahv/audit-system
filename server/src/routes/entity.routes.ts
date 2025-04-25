import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  getAllEntities, 
  getEntityById, 
  createEntity, 
  updateEntity, 
  deleteEntity 
} from '../controllers/entity.controller';

const router = express.Router();

// Public routes
router.get('/', getAllEntities);
router.get('/:id', getEntityById);

// Protected routes
router.post('/', authenticate, createEntity);
router.put('/:id', authenticate, updateEntity);
router.delete('/:id', authenticate, authorize(['admin', 'manager']), deleteEntity);

export default router;
