import express from 'express';
import { register, login, getCurrentUser, getDemoAccounts } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register); // GK-2
router.post('/login', login);       // GK-3
router.get('/demo-accounts', getDemoAccounts);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;
