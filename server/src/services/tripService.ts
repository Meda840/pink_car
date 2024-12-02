import { prisma } from '../models/prismaClient';
import { validateTrip, validateTripUpdate, TripData } from '../models/validateTrip';

async function createTrip(tripData: TripData) {
  try {
    await validateTrip(tripData);

    const newTrip = await prisma.trip.create({
      data: {
        start: tripData.start,
        destination: tripData.destination,
        price: tripData.price || null,
        numberPassengers: tripData.numberPassengers || null,
        description: tripData.description || null,
        // Connect to the existing driver
        driver: {
          connect: { id: tripData.driverId },
        },
        // Connect to the existing passenger
        passenger: {
          connect: { id: tripData.passengerId },
        },
      },
    });

    return newTrip;
  } catch (error) {
    console.error('Error creating trip:', error);
    return null;
  }
}

async function getAllTrips() {
  try {
    return await prisma.trip.findMany({
      include: {
        driver: true,
        passenger: true,
      },
    });
  } catch (error) {
    console.error('Error fetching all trips:', error);
    return [];
  }
}

async function getTripById(id: number) {
  try {
    return await prisma.trip.findUnique({
      where: { id },
      include: {
        driver: true,
        passenger: true,
      },
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

async function updateTrip(id: number, tripData: TripData): Promise<void> {
  try {
    await validateTripUpdate(tripData);

    if (tripData.driverId) {
      // Check if the driver and passenger exist before updating
      const driverExists = await prisma.driver_Profile.findUnique({
          where: { id: tripData.driverId },
      });
      if (!driverExists) {
        console.error(`Driver with ID ${tripData.driverId} does not exist.`);
        return;
      }
    }

    if (tripData.passengerId) {
      const passengerExists = await prisma.passenger_Profile.findUnique({
          where: { id: tripData.passengerId },
      });
      if (!passengerExists) {
        console.error(`Passenger with ID ${tripData.passengerId} does not exist.`);
        return;
      }
    }

    // Update the trip
    await prisma.trip.update({
        where: { id },
        data: {
            start: tripData.start,
            destination: tripData.destination,
            price: tripData.price,
            numberPassengers: tripData.numberPassengers,
            description: tripData.description,
            // Update driver if needed
            driver: tripData.driverId ? {
                connect: { id: tripData.driverId },
            } : undefined,
            // Update passenger if needed
            passenger: tripData.passengerId ? {
                connect: { id: tripData.passengerId },
            } : undefined,
        },
    });

    console.log(`Trip with ID ${id} has been updated.`);
  } catch (error) {
    console.error('Error updating trip:', error);
    return;
  }
}

async function deleteTrip(id: number): Promise<void> {
  try {
    await prisma.trip.delete({
      where: { id },
    });

    console.log(`Trip with ID ${id} has been deleted.`);
  } catch (error) {
    console.error('Error deleting trip:', error);
    return;
  }
}

export { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip };
