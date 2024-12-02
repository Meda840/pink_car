import express from 'express';
import authController from '../controllers/authController';

const router = express.Router();

// Set login route
router.post('/login', authController.loginUser);

// Set register route
router.post('/register', authController.registerUser);

export default router;
