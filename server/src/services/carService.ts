import { prisma, Prisma } from '../models/prismaClient';
import { validateCar, validateCarUpdate } from '../models/validateCar';

async function createCar(carData: any) {
  // Validate data fields
  validateCar(carData);

  try {
    return await prisma.car.create({
      data: carData,
    });
  } catch (error) {
    console.error('Error creating car:', error, '\nPlease check the data and try again.');
    return;
  }
}

async function getAllCars() {
  try {
    return await prisma.car.findMany();
  } catch (error) {
    console.error('Error fetching all car');
    return;
  }
}

async function getCarById(carId: number) {
  try {
    return await prisma.car.findUnique({
      where: { id: carId },
    });
  } catch (error) {
    console.error('Error fetching car');
    return;
  }
}

async function updateCar(carId: number, carData: Record<string, unknown>) {
    // Validate data fields
    validateCarUpdate(carData);
    
  try {
    return await prisma.car.update({
      where: { id: carId },
      data: carData,
    });
  } catch (error) {
    console.error('Error updating car');
    return;
  }
}

async function deleteCar(carId: number) {
  try {
    await prisma.$transaction(async (transaction) => {
      // Find all drivers associated with the car
      const driversToDisconnect = await transaction.driver_Profile.findMany({
        where: {
          favorite_cars: {
            some: { id: carId },
          },
        },
        select: { id: true },
      });
      
      // Disconnect the car from each driver
      for (const driver of driversToDisconnect) {
        await transaction.driver_Profile.update({
          where: { id: driver.id },
          data: {
            favorite_cars: {
              disconnect: { id: carId },
            },
          },
        });
      }

      // Check if the car exists before attempting to delete
      const carExists = await transaction.car.findUnique({
        where: { id: carId },
      });

      if (!carExists) {
        console.error(`Car with ID ${carId} does not exist.`);
        return;
      }

      // Delete the car
      await transaction.car.delete({
        where: { id: carId },
      });

      console.log(`Car with ID ${carId} has been deleted.`);
    });
  } catch (error) {
    console.error('Error deleting car:', error);
  }
}

export { createCar, getAllCars, getCarById, updateCar , deleteCar };
