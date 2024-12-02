import express from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';

const router = express.Router();

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user by ID
router.put('/:id', userController.updateUser);

// Delete user by ID
router.delete('/:id', userController.deleteUser);

// Create a new user
router.post('/register', authController.registerUser);

export default router;
