import { Request, Response } from 'express';
import { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from '../services/tripService';

class TripController {
    async createTrip(req: Request, res: Response) {
        try {
            const newTrip = await createTrip(req.body);
            res.status(201).json(newTrip);
        } catch (error) {
            res.status(500).json({ error: 'Error creating trip' });
        }
    }

    async getAllTrips(req: Request, res: Response) {
        try {
            const allTrips = await getAllTrips();
            res.status(200).json(allTrips);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching all trips' });
        }
    }

    async getTripById(req: Request, res: Response) {
        const tripId = parseInt(req.params.id);
        try {
            const trip = await getTripById(tripId);
            if (!trip) {
                res.status(404).json({ error: 'Trip not found' });
            } else {
                res.status(200).json(trip);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error fetching trip' });
        }
    }

    async updateTrip(req: Request, res: Response) {
        const tripId = parseInt(req.params.id);
        try {
            const updatedTrip = await updateTrip(tripId, req.body);
            res.status(200).json(updatedTrip);
        } catch (error) {
            res.status(500).json({ error: 'Error updating trip' });
        }
    }

    async deleteTrip(req: Request, res: Response) {
        const tripId = parseInt(req.params.id);
        try {
            await deleteTrip(tripId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting trip' });
        }
    }
}

export default new TripController();
