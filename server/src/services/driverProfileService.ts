import { prisma, Prisma } from '../models/prismaClient';
import { validateDriverProfile , validateDriverProfileUpdate, DriverProfile } from '../models/validateDriverProfile';

async function createDriverProfile(driverData: DriverProfile) {
    try {
        validateDriverProfile(driverData);

        const newDriverProfile = await prisma.driver_Profile.create({
            data: {
            userId: driverData.userId,
            drivingLicence: driverData.drivingLicence,
            photo: driverData.photo || null,
            biography: driverData.biography || null,
            location: driverData.location,
            // Connect existing favorite cars
            favorite_cars: {
                connect: driverData.favorite_cars?.map(id => ({ id })) || [],
            },
            // Connect existing trips
            trips: {
                connect: driverData.trips?.map(id => ({ id })) || [],
            },
            // Connect existing passenger profiles
            favorite_passengers: {
                connect: driverData.favorite_passengers?.map(id => ({ id })) || [],
            },
            },
        });

        // Request format
        // {
        //     "userId": 1,
        //     "drivingLicence": "../images/DL/driver2",
        //     "photo": "../images/photos/driver2",
        //     "biography": "jsaopdsaklsadklajdslkjdsalkdsjlkadskcsnalkcsnsacncsj",
        //     "location": "Marrakech",
        //     "favorite_cars": [4, 2],
        //     "favorite_passengers": [],
        //     "trips": []
        // }

        return newDriverProfile;
    } catch (error) {
        console.error('Error creating driver profile:', error);
        return null;
    }
}

async function getAllDriverProfiles() {
    try {
        return await prisma.driver_Profile.findMany({
          include: {
            favorite_cars: true,
            favorite_passengers: true,
            trips: true, // Include all trips related to the driver
          },
        });
      } catch (error) {
        console.error('Error fetching all driver profiles:', error);
        return [];
      }
}

async function getDriverProfileById(id: number) {
    try {
        return await prisma.driver_Profile.findUnique({
          where: { id },
          include: {
            favorite_cars: true,
            trips: true,
            favorite_passengers: true,
          },
        });
    } catch (error) {
        console.error('Error fetching driver profile');
        return null;
    }
}

async function updateDriverProfile(id: number, driverData: DriverProfile): Promise<void> {
    try {
        validateDriverProfileUpdate(driverData);
        let carsToDisconnect: number[] = [];
        let passengersToDisconnect: number[] = [];

        await prisma.$transaction(async (transaction) => {
            // Fetch the current driver profile and relationships
            const currentProfile = await transaction.driver_Profile.findUnique({
                where: { id },
                include: {
                    favorite_cars: true,
                    favorite_passengers: true, // Include favorite_passengers relation
                    trips: true,
                },
            });

            if (!currentProfile) {
                console.error(`Driver profile with ID ${id} not found.`);
                return;
            }

            if (driverData.favorite_cars) {
                // Determine which cars need to be disconnected
                carsToDisconnect = currentProfile.favorite_cars
                    .filter(car => !driverData.favorite_cars?.includes(car.id))
                    .map(car => car.id);
            }

            if (driverData.favorite_passengers) {
                // Determine which passengers need to be disconnected
                passengersToDisconnect = currentProfile.favorite_passengers
                    .filter(passenger => !driverData.favorite_passengers?.includes(passenger.id))
                    .map(passenger => passenger.id);
            }

            // Validate passenger profile IDs
            const existingPassengerProfiles = await transaction.passenger_Profile.findMany({
                where: {
                    id: { in: driverData.favorite_passengers || [] },
                },
                select: { id: true },
            });

            const validPassengerIds = new Set(existingPassengerProfiles.map(p => p.id));

            // Filter out invalid passenger IDs
            const passengersToConnect = (driverData.favorite_passengers || []).filter(
                passengerId => validPassengerIds.has(passengerId)
            );

            // Log invalid passenger IDs
            const invalidPassengerIds = (driverData.favorite_passengers || []).filter(
                passengerId => !validPassengerIds.has(passengerId)
            );

            if (invalidPassengerIds.length > 0) {
                console.warn('Invalid passenger IDs:', invalidPassengerIds);
            }

            // Prepare data for updating the driver profile
            const updateData: Prisma.Driver_ProfileUpdateInput = {};

            if (driverData.photo !== undefined && driverData.photo !== currentProfile.photo) {
                updateData.photo = driverData.photo;
            }
            if (driverData.biography !== undefined && driverData.biography !== currentProfile.biography) {
                updateData.biography = driverData.biography;
            }
            if (driverData.location !== undefined && driverData.location !== currentProfile.location) {
                updateData.location = driverData.location;
            }
            if (driverData.drivingLicence !== undefined && driverData.drivingLicence !== currentProfile.drivingLicence) {
                updateData.drivingLicence = driverData.drivingLicence;
            }

            // Update the driver profile
            await transaction.driver_Profile.update({
                where: { id },
                data: {
                    ...updateData,
                    // Update favorite cars
                    favorite_cars: {
                        connect: driverData.favorite_cars?.map((carId: number) => ({ id: carId })) || [],
                        disconnect: carsToDisconnect.map((carId: number) => ({ id: carId })),
                    },
                    // Update passenger profiles
                    favorite_passengers: {
                        connect: driverData.favorite_passengers?.map((passengerId: number) => ({ id: passengerId })) || [],
                        disconnect: passengersToDisconnect.map((passengerId: number) => ({ id: passengerId })),
                    },
                    // Update trips
                    trips: {
                        connect: driverData.trips?.map((tripId: number) => ({ id: tripId })) || [],
                    },
                },
            });

            // If userId is being updated, handle the changes in the Users model and related profiles
            if (driverData.userId !== undefined && driverData.userId !== currentProfile.userId) {
                // Ensure the new userId exists in the Users table
                const newUser = await transaction.users.findUnique({
                    where: { id: driverData.userId },
                });

                if (!newUser) {
                    console.error(`User with ID ${driverData.userId} does not exist.`);
                    return;
                }

                // Update the driver profile with the new userId
                await transaction.driver_Profile.update({
                    where: { id },
                    data: {
                        ...updateData,
                        users: {
                            connect: { id: driverData.userId }
                        },
                        // Update favorite cars
                        favorite_cars: {
                            connect: driverData.favorite_cars?.map((carId: number) => ({ id: carId })) || [],
                            disconnect: carsToDisconnect.map((carId: number) => ({ id: carId })),
                        },
                        // Update passenger profiles
                        favorite_passengers: {
                            connect: driverData.favorite_passengers?.map((passengerId: number) => ({ id: passengerId })) || [],
                            disconnect: passengersToDisconnect.map((passengerId: number) => ({ id: passengerId })),
                        },
                        // Update trips
                        trips: {
                            connect: driverData.trips?.map((tripId: number) => ({ id: tripId })) || [],
                        },
                    },
                });
            } else {
                // If userId is not changed, just update other fields
                await transaction.driver_Profile.update({
                    where: { id },
                    data: {
                        ...updateData,
                    },
                });
            }

            console.log(`Driver profile with ID ${id} has been updated.`);
        });
    } catch (error) {
        console.error('Error updating driver profile:', error);
        return;
    }
}


async function deleteDriverProfile(id: number): Promise<void> {
    try {
        await prisma.$transaction(async (transaction) => {
            // Check if the driver profile exists
            const driverProfile = await transaction.driver_Profile.findUnique({
                where: { id },
            });

            if (!driverProfile) {
                console.error(`Driver profile with ID ${id} does not exist.`);
                return;
            }

            // Disconnect favorite cars
            const carsToDisconnect = await transaction.car.findMany({
                where: {
                    drivers: {
                        some: { id },
                    },
                },
                select: { id: true },
            });

            for (const car of carsToDisconnect) {
                await transaction.car.update({
                    where: { id: car.id },
                    data: {
                        drivers: {
                            disconnect: { id },
                        },
                    },
                });
            }

            // Delete trips associated with the driver
            await transaction.trip.deleteMany({
                where: {
                    driverId: id,
                },
            });

            // Disconnect from passenger profiles
            const profilesToDisconnect = await transaction.passenger_Profile.findMany({
                where: {
                    favorite_drivers: {
                        some: { id },
                    },
                },
                select: { id: true },
            });

            for (const profile of profilesToDisconnect) {
                await transaction.passenger_Profile.update({
                    where: { id: profile.id },
                    data: {
                        favorite_drivers: {
                            disconnect: { id },
                        },
                    },
                });
            }

            // Disconnect favorite passengers
            const passengersToDisconnect = await transaction.passenger_Profile.findMany({
                where: {
                    favorite_of_drivers: {
                        some: { id },
                    },
                },
                select: { id: true },
            });

            for (const passenger of passengersToDisconnect) {
                await transaction.passenger_Profile.update({
                    where: { id: passenger.id },
                    data: {
                        favorite_of_drivers: {
                            disconnect: { id },
                        },
                    },
                });
            }

            // Delete the driver profile
            await transaction.driver_Profile.delete({
                where: { id },
            });

            console.log(`Driver profile with ID ${id} has been deleted.`);
        });
        
    } catch (error) {
        console.error('Error deleting driver profile:', error);
        return;
    }
}

export { createDriverProfile, getAllDriverProfiles, getDriverProfileById, updateDriverProfile, deleteDriverProfile };
