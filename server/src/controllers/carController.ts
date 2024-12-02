import { Request, Response } from 'express';
import { createCar, getAllCars, getCarById, updateCar , deleteCar } from '../services/carService';

class carController {
  async createCar(req: Request, res: Response) {
    try {
      const newCar = await createCar(req.body);
      res.status(201).json(newCar);
    } catch (error) {
      res.status(500).json({ error: 'Error creating car' });
    }
  }

  async getAllCars(req: Request, res: Response) {
    try {
      const allCars = await getAllCars();
      res.status(200).json(allCars);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching all cars' });
    }
  }

  async getCarById(req: Request, res: Response) {
    const carId = parseInt(req.params.id);
    try {
      const car = await getCarById(carId);
      if (!car) {
        res.status(404).json({ error: 'car not found' });
      } else {
        res.status(200).json(car);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching car' });
    }
  }

  async updateCar(req: Request, res: Response) {
    const carId = parseInt(req.params.id);
    try {
      const updatedCar = await updateCar(carId, req.body);
      res.status(200).json(updatedCar);
    } catch (error) {
      res.status(500).json({ error: 'Error updating car' });
    }
  }

  async deleteCar(req: Request, res: Response) {
    const carId = parseInt(req.params.id);
    try {
      await deleteCar(carId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting car' });
    }
  }
}

export default new carController();
