// routes/userRoutes.js
import express from 'express';
import { createUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Create user
router.post('/', createUser);

// List all users (optional helper for testing)
router.get('/', getAllUsers);

export default router;
