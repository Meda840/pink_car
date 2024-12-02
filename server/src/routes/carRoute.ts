import express from 'express';
import carController from '../controllers/carController';

const router = express.Router();

// Create a new user
router.post('/', carController.createCar);

// Get all users
router.get('/', carController.getAllCars);

// Get user by ID
router.get('/:id', carController.getCarById);

// Update user by ID
router.put('/:id', carController.updateCar);

// Delete user by ID
router.delete('/:id', carController.deleteCar);

export default router;
