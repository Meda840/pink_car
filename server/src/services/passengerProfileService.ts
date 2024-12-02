import { prisma, Prisma } from '../models/prismaClient';
import { validatePassengerProfile, validatePassengerProfileUpdate, PassengerProfile } from '../models/validatePassengerProfile';

async function createPassengerProfile(passengerData: PassengerProfile) {
    try {
        validatePassengerProfile(passengerData);

        const newPassengerProfile = await prisma.passenger_Profile.create({
            data: {
                userId: passengerData.userId,
                photo: passengerData.photo || null,
                biography: passengerData.biography || null,
                // Connect existing favorite drivers
                favorite_drivers: {
                    connect: passengerData.favorite_drivers?.map(id => ({ id })) || [],
                },
                // Connect existing trips
                trips: {
                    connect: passengerData.trips?.map(id => ({ id })) || [],
                },
            },
        });

        return newPassengerProfile;
    } catch (error) {
        console.error('Error creating passenger profile:', error);
        return null;
    }
}

async function getAllPassengerProfiles() {
    try {
        return await prisma.passenger_Profile.findMany({
            include: {
                favorite_drivers: true,
                trips: true, // Include all trips related to the passenger
            },
        });
    } catch (error) {
        console.error('Error fetching all passenger profiles:', error);
        return [];
    }
}

async function getPassengerProfileById(id: number) {
    try {
        return await prisma.passenger_Profile.findUnique({
            where: { id },
            include: {
                favorite_drivers: true,
                trips: true,
            },
        });
    } catch (error) {
        console.error('Error fetching passenger profile:', error);
        return null;
    }
}

async function updatePassengerProfile(id: number, passengerData: PassengerProfile): Promise<void> {
    try {
        validatePassengerProfileUpdate(passengerData);
        let driversToDisconnect: number[] = [];

        await prisma.$transaction(async (transaction) => {
            // Fetch the current passenger profile and relationships
            const currentProfile = await transaction.passenger_Profile.findUnique({
                where: { id },
                include: {
                    favorite_drivers: true,
                    trips: true,
                },
            });

            if (!currentProfile) {
                console.error(`Passenger profile with ID ${id} not found.`);
                return;
            }

            if (passengerData.favorite_drivers) {
                // Determine which drivers need to be disconnected
                driversToDisconnect = currentProfile.favorite_drivers
                    .filter(driver => !passengerData.favorite_drivers?.includes(driver.id))
                    .map(driver => driver.id);
            }

            // Prepare data for updating the passenger profile
            const updateData: Prisma.Passenger_ProfileUpdateInput = {};

            if (passengerData.photo !== undefined && passengerData.photo !== currentProfile.photo) {
                updateData.photo = passengerData.photo;
            }
            if (passengerData.biography !== undefined && passengerData.biography !== currentProfile.biography) {
                updateData.biography = passengerData.biography;
            }

            // Update the passenger profile
            await transaction.passenger_Profile.update({
                where: { id },
                data: {
                    ...updateData,
                    // Update favorite drivers
                    favorite_drivers: {
                        connect: passengerData.favorite_drivers?.map((id: number) => ({ id })) || [],
                        disconnect: driversToDisconnect.map((id: number) => ({ id })),
                    },
                    // Update trips
                    trips: {
                        connect: passengerData.trips?.map((id: number) => ({ id })) || [],
                    },
                },
            });

            // If userId is being updated, handle the changes in the Users model and related profiles
            if (passengerData.userId !== undefined && passengerData.userId !== currentProfile.userId) {
                // Ensure the new userId exists in the Users table
                const newUser = await transaction.users.findUnique({
                    where: { id: passengerData.userId },
                });

                if (!newUser) {
                    console.error(`User with ID ${passengerData.userId} does not exist.`);
                    return;
                }

                // Update the passenger profile with the new userId
                await transaction.passenger_Profile.update({
                    where: { id },
                    data: {
                        ...updateData,
                        users: {
                            connect: { id: passengerData.userId }
                        },
                        // Update favorite drivers
                        favorite_drivers: {
                            connect: passengerData.favorite_drivers?.map((id: number) => ({ id })) || [],
                            disconnect: driversToDisconnect.map((id: number) => ({ id })),
                        },
                        // Update trips
                        trips: {
                            connect: passengerData.trips?.map((id: number) => ({ id })) || [],
                        },
                    },
                });
            } else {
                // If userId is not changed, just update other fields
                await transaction.passenger_Profile.update({
                    where: { id },
                    data: {
                        ...updateData,
                    },
                });
            }

            console.log(`Passenger profile with ID ${id} has been updated.`);
        });
    } catch (error) {
        console.error('Error updating passenger profile:', error);
        return;
    }
}

async function deletePassengerProfile(id: number): Promise<void> {
    try {
        await prisma.$transaction(async (transaction) => {
            // Find the passenger profile to be deleted
            const passengerProfile = await transaction.passenger_Profile.findUnique({
                where: { id },
                include: {
                    favorite_drivers: true, // Include the related drivers to disconnect
                    trips: true, // Include trips to delete them
                },
            });

            if (!passengerProfile) {
                console.error(`Passenger profile with ID ${id} not found.`);
                return;
            }

            // Disconnect favorite drivers
            for (const driver of passengerProfile.favorite_drivers) {
                await transaction.passenger_Profile.update({
                    where: { id: passengerProfile.id },
                    data: {
                        favorite_drivers: {
                            disconnect: { id: driver.id },
                        },
                    },
                });
            }

            // Delete trips associated with the passenger
            await transaction.trip.deleteMany({
                where: {
                    passengerId: id, // Match trips where passengerId equals the removed passenger's ID
                },
            });

            // Delete the passenger profile
            await transaction.passenger_Profile.delete({
                where: { id },
            });

            console.log(`Passenger profile with ID ${id} has been deleted.`);
        });
    } catch (error) {
        console.error('Error deleting passenger profile:', error);
        return;
    }
}


export { createPassengerProfile, getAllPassengerProfiles, getPassengerProfileById, updatePassengerProfile, deletePassengerProfile };
