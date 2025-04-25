import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { 
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  assignRole
} from '../controllers/auth.controller';

const router = express.Router();

// User profile routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

// Admin routes
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.post('/users/:id/role', authenticate, authorize(['admin']), assignRole);

export default router;
