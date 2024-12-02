import express from 'express';
import tripController from '../controllers/tripController';

const router = express.Router();

// Create a new passenger profile
router.post('/', tripController.createTrip);

// Retrieve all passenger profiles
router.get('/', tripController.getAllTrips);

// Retrieve a passenger profile by ID
router.get('/:id', tripController.getTripById);

// Update a passenger profile by ID
router.put('/:id', tripController.updateTrip);

// Delete a passenger profile by ID
router.delete('/:id', tripController.deleteTrip);

export default router;