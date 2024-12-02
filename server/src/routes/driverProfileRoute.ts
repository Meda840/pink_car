import express from 'express';
import driverProfileController from '../controllers/driverProfileController';

const router = express.Router();

// Create a new driver profile
router.post('/', driverProfileController.createDriverProfile);

// Retrieve all driver profiles
router.get('/', driverProfileController.getAllDriverProfiles);

// Retrieve a driver profile by ID
router.get('/:id', driverProfileController.getDriverProfileById);

// Update a driver profile by ID
router.put('/:id', driverProfileController.updateDriverProfile);

// Delete a driver profile by ID
router.delete('/:id', driverProfileController.deleteDriverProfile);

export default router;