import express from 'express';
import passengerProfileController from '../controllers/passengerProfileController';

const router = express.Router();

// Create a new passenger profile
router.post('/', passengerProfileController.createPassengerProfile);

// Retrieve all passenger profiles
router.get('/', passengerProfileController.getAllPassengerProfiles);

// Retrieve a passenger profile by ID
router.get('/:id', passengerProfileController.getPassengerProfileById);

// Update a passenger profile by ID
router.put('/:id', passengerProfileController.updatePassengerProfile);

// Delete a passenger profile by ID
router.delete('/:id', passengerProfileController.deletePassengerProfile);

export default router;