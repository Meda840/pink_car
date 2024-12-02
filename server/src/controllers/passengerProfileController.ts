import { Request, Response } from 'express';
import { createPassengerProfile, getAllPassengerProfiles, getPassengerProfileById, updatePassengerProfile, deletePassengerProfile } from '../services/passengerProfileService';

class PassengerProfileController {
    async createPassengerProfile(req: Request, res: Response) {
        try {
            const newPassengerProfile = await createPassengerProfile(req.body);
            res.status(201).json(newPassengerProfile);
        } catch (error) {
            res.status(500).json({ error: 'Error creating passenger profile' });
        }
    }

    async getAllPassengerProfiles(req: Request, res: Response) {
        try {
            const allPassengerProfiles = await getAllPassengerProfiles();
            res.status(200).json(allPassengerProfiles);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching all passenger profiles' });
        }
    }

    async getPassengerProfileById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const passengerProfile = await getPassengerProfileById(userId);
            if (!passengerProfile) {
                res.status(404).json({ error: 'Passenger profile not found' });
            } else {
                res.status(200).json(passengerProfile);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error fetching passenger profile' });
        }
    }

    async updatePassengerProfile(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const updatedPassengerProfile = await updatePassengerProfile(userId, req.body);
            res.status(200).json(updatedPassengerProfile);
        } catch (error) {
            res.status(500).json({ error: 'Error updating passenger profile' });
        }
    }

    async deletePassengerProfile(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            await deletePassengerProfile(userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting passenger profile' });
        }
    }
}

export default new PassengerProfileController();
