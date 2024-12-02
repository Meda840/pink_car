"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPassengerProfile = createPassengerProfile;
exports.getAllPassengerProfiles = getAllPassengerProfiles;
exports.getPassengerProfileById = getPassengerProfileById;
exports.updatePassengerProfile = updatePassengerProfile;
exports.deletePassengerProfile = deletePassengerProfile;
const prismaClient_1 = require("../models/prismaClient");
const validatePassengerProfile_1 = require("../models/validatePassengerProfile");
function createPassengerProfile(passengerData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            (0, validatePassengerProfile_1.validatePassengerProfile)(passengerData);
            const newPassengerProfile = yield prismaClient_1.prisma.passenger_Profile.create({
                data: {
                    userId: passengerData.userId,
                    photo: passengerData.photo || null,
                    biography: passengerData.biography || null,
                    // Connect existing favorite drivers
                    favorite_drivers: {
                        connect: ((_a = passengerData.favorite_drivers) === null || _a === void 0 ? void 0 : _a.map(id => ({ id }))) || [],
                    },
                    // Connect existing trips
                    trips: {
                        connect: ((_b = passengerData.trips) === null || _b === void 0 ? void 0 : _b.map(id => ({ id }))) || [],
                    },
                },
            });
            return newPassengerProfile;
        }
        catch (error) {
            console.error('Error creating passenger profile:', error);
            return null;
        }
    });
}
function getAllPassengerProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.passenger_Profile.findMany({
                include: {
                    favorite_drivers: true,
                    trips: true, // Include all trips related to the passenger
                },
            });
        }
        catch (error) {
            console.error('Error fetching all passenger profiles:', error);
            return [];
        }
    });
}
function getPassengerProfileById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.passenger_Profile.findUnique({
                where: { id },
                include: {
                    favorite_drivers: true,
                    trips: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching passenger profile:', error);
            return null;
        }
    });
}
function updatePassengerProfile(id, passengerData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, validatePassengerProfile_1.validatePassengerProfileUpdate)(passengerData);
            let driversToDisconnect = [];
            yield prismaClient_1.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                // Fetch the current passenger profile and relationships
                const currentProfile = yield transaction.passenger_Profile.findUnique({
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
                        .filter(driver => { var _a; return !((_a = passengerData.favorite_drivers) === null || _a === void 0 ? void 0 : _a.includes(driver.id)); })
                        .map(driver => driver.id);
                }
                // Prepare data for updating the passenger profile
                const updateData = {};
                if (passengerData.photo !== undefined && passengerData.photo !== currentProfile.photo) {
                    updateData.photo = passengerData.photo;
                }
                if (passengerData.biography !== undefined && passengerData.biography !== currentProfile.biography) {
                    updateData.biography = passengerData.biography;
                }
                // Update the passenger profile
                yield transaction.passenger_Profile.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, updateData), { 
                        // Update favorite drivers
                        favorite_drivers: {
                            connect: ((_a = passengerData.favorite_drivers) === null || _a === void 0 ? void 0 : _a.map((id) => ({ id }))) || [],
                            disconnect: driversToDisconnect.map((id) => ({ id })),
                        }, 
                        // Update trips
                        trips: {
                            connect: ((_b = passengerData.trips) === null || _b === void 0 ? void 0 : _b.map((id) => ({ id }))) || [],
                        } }),
                });
                // If userId is being updated, handle the changes in the Users model and related profiles
                if (passengerData.userId !== undefined && passengerData.userId !== currentProfile.userId) {
                    // Ensure the new userId exists in the Users table
                    const newUser = yield transaction.users.findUnique({
                        where: { id: passengerData.userId },
                    });
                    if (!newUser) {
                        console.error(`User with ID ${passengerData.userId} does not exist.`);
                        return;
                    }
                    // Update the passenger profile with the new userId
                    yield transaction.passenger_Profile.update({
                        where: { id },
                        data: Object.assign(Object.assign({}, updateData), { users: {
                                connect: { id: passengerData.userId }
                            }, 
                            // Update favorite drivers
                            favorite_drivers: {
                                connect: ((_c = passengerData.favorite_drivers) === null || _c === void 0 ? void 0 : _c.map((id) => ({ id }))) || [],
                                disconnect: driversToDisconnect.map((id) => ({ id })),
                            }, 
                            // Update trips
                            trips: {
                                connect: ((_d = passengerData.trips) === null || _d === void 0 ? void 0 : _d.map((id) => ({ id }))) || [],
                            } }),
                    });
                }
                else {
                    // If userId is not changed, just update other fields
                    yield transaction.passenger_Profile.update({
                        where: { id },
                        data: Object.assign({}, updateData),
                    });
                }
                console.log(`Passenger profile with ID ${id} has been updated.`);
            }));
        }
        catch (error) {
            console.error('Error updating passenger profile:', error);
            return;
        }
    });
}
function deletePassengerProfile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                // Find the passenger profile to be deleted
                const passengerProfile = yield transaction.passenger_Profile.findUnique({
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
                    yield transaction.passenger_Profile.update({
                        where: { id: passengerProfile.id },
                        data: {
                            favorite_drivers: {
                                disconnect: { id: driver.id },
                            },
                        },
                    });
                }
                // Delete trips associated with the passenger
                yield transaction.trip.deleteMany({
                    where: {
                        passengerId: id, // Match trips where passengerId equals the removed passenger's ID
                    },
                });
                // Delete the passenger profile
                yield transaction.passenger_Profile.delete({
                    where: { id },
                });
                console.log(`Passenger profile with ID ${id} has been deleted.`);
            }));
        }
        catch (error) {
            console.error('Error deleting passenger profile:', error);
            return;
        }
    });
}
