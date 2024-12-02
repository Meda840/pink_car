import { Request, Response } from 'express';
import { createDriverProfile, getAllDriverProfiles, getDriverProfileById, updateDriverProfile, deleteDriverProfile } from '../services/driverProfileService';

class driverProfileController {
    async createDriverProfile(req: Request, res: Response) {
        try {
            const newDriverProfile = await createDriverProfile(req.body);
            res.status(201).json(newDriverProfile);
        } catch (error) {
            res.status(500).json({ error: 'Error creating driver profile' });
        }
    }

    async getAllDriverProfiles(req: Request, res: Response) {
        try {
            const allDriverProfiles = await getAllDriverProfiles();
            res.status(200).json(allDriverProfiles);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching all driver profiles' });
        }
    }

    async getDriverProfileById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const driverProfile = await getDriverProfileById(userId);
            if (!driverProfile) {
                res.status(404).json({ error: 'Driver profile not found' });
            } else {
                res.status(200).json(driverProfile);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error fetching driver profile' });
        }
    }

    async updateDriverProfile(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            const updatedDriverProfile = await updateDriverProfile(userId, req.body);
            res.status(200).json(updatedDriverProfile);
        } catch (error) {
            res.status(500).json({ error: 'Error updating driver profile' });
        }
    }

    async deleteDriverProfile(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        try {
            await deleteDriverProfile(userId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting driver profile' });
        }
    }
}

export default new driverProfileController();
