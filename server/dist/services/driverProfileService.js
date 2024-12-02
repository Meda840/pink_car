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
exports.createDriverProfile = createDriverProfile;
exports.getAllDriverProfiles = getAllDriverProfiles;
exports.getDriverProfileById = getDriverProfileById;
exports.updateDriverProfile = updateDriverProfile;
exports.deleteDriverProfile = deleteDriverProfile;
const prismaClient_1 = require("../models/prismaClient");
const validateDriverProfile_1 = require("../models/validateDriverProfile");
function createDriverProfile(driverData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            (0, validateDriverProfile_1.validateDriverProfile)(driverData);
            const newDriverProfile = yield prismaClient_1.prisma.driver_Profile.create({
                data: {
                    userId: driverData.userId,
                    drivingLicence: driverData.drivingLicence,
                    photo: driverData.photo || null,
                    biography: driverData.biography || null,
                    location: driverData.location,
                    // Connect existing favorite cars
                    favorite_cars: {
                        connect: ((_a = driverData.favorite_cars) === null || _a === void 0 ? void 0 : _a.map(id => ({ id }))) || [],
                    },
                    // Connect existing trips
                    trips: {
                        connect: ((_b = driverData.trips) === null || _b === void 0 ? void 0 : _b.map(id => ({ id }))) || [],
                    },
                    // Connect existing passenger profiles
                    favorite_passengers: {
                        connect: ((_c = driverData.favorite_passengers) === null || _c === void 0 ? void 0 : _c.map(id => ({ id }))) || [],
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
        }
        catch (error) {
            console.error('Error creating driver profile:', error);
            return null;
        }
    });
}
function getAllDriverProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.driver_Profile.findMany({
                include: {
                    favorite_cars: true,
                    favorite_passengers: true,
                    trips: true, // Include all trips related to the driver
                },
            });
        }
        catch (error) {
            console.error('Error fetching all driver profiles:', error);
            return [];
        }
    });
}
function getDriverProfileById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.driver_Profile.findUnique({
                where: { id },
                include: {
                    favorite_cars: true,
                    trips: true,
                    favorite_passengers: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching driver profile');
            return null;
        }
    });
}
function updateDriverProfile(id, driverData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, validateDriverProfile_1.validateDriverProfileUpdate)(driverData);
            let carsToDisconnect = [];
            let passengersToDisconnect = [];
            yield prismaClient_1.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f;
                // Fetch the current driver profile and relationships
                const currentProfile = yield transaction.driver_Profile.findUnique({
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
                        .filter(car => { var _a; return !((_a = driverData.favorite_cars) === null || _a === void 0 ? void 0 : _a.includes(car.id)); })
                        .map(car => car.id);
                }
                if (driverData.favorite_passengers) {
                    // Determine which passengers need to be disconnected
                    passengersToDisconnect = currentProfile.favorite_passengers
                        .filter(passenger => { var _a; return !((_a = driverData.favorite_passengers) === null || _a === void 0 ? void 0 : _a.includes(passenger.id)); })
                        .map(passenger => passenger.id);
                }
                // Validate passenger profile IDs
                const existingPassengerProfiles = yield transaction.passenger_Profile.findMany({
                    where: {
                        id: { in: driverData.favorite_passengers || [] },
                    },
                    select: { id: true },
                });
                const validPassengerIds = new Set(existingPassengerProfiles.map(p => p.id));
                // Filter out invalid passenger IDs
                const passengersToConnect = (driverData.favorite_passengers || []).filter(passengerId => validPassengerIds.has(passengerId));
                // Log invalid passenger IDs
                const invalidPassengerIds = (driverData.favorite_passengers || []).filter(passengerId => !validPassengerIds.has(passengerId));
                if (invalidPassengerIds.length > 0) {
                    console.warn('Invalid passenger IDs:', invalidPassengerIds);
                }
                // Prepare data for updating the driver profile
                const updateData = {};
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
                yield transaction.driver_Profile.update({
                    where: { id },
                    data: Object.assign(Object.assign({}, updateData), { 
                        // Update favorite cars
                        favorite_cars: {
                            connect: ((_a = driverData.favorite_cars) === null || _a === void 0 ? void 0 : _a.map((carId) => ({ id: carId }))) || [],
                            disconnect: carsToDisconnect.map((carId) => ({ id: carId })),
                        }, 
                        // Update passenger profiles
                        favorite_passengers: {
                            connect: ((_b = driverData.favorite_passengers) === null || _b === void 0 ? void 0 : _b.map((passengerId) => ({ id: passengerId }))) || [],
                            disconnect: passengersToDisconnect.map((passengerId) => ({ id: passengerId })),
                        }, 
                        // Update trips
                        trips: {
                            connect: ((_c = driverData.trips) === null || _c === void 0 ? void 0 : _c.map((tripId) => ({ id: tripId }))) || [],
                        } }),
                });
                // If userId is being updated, handle the changes in the Users model and related profiles
                if (driverData.userId !== undefined && driverData.userId !== currentProfile.userId) {
                    // Ensure the new userId exists in the Users table
                    const newUser = yield transaction.users.findUnique({
                        where: { id: driverData.userId },
                    });
                    if (!newUser) {
                        console.error(`User with ID ${driverData.userId} does not exist.`);
                        return;
                    }
                    // Update the driver profile with the new userId
                    yield transaction.driver_Profile.update({
                        where: { id },
                        data: Object.assign(Object.assign({}, updateData), { users: {
                                connect: { id: driverData.userId }
                            }, 
                            // Update favorite cars
                            favorite_cars: {
                                connect: ((_d = driverData.favorite_cars) === null || _d === void 0 ? void 0 : _d.map((carId) => ({ id: carId }))) || [],
                                disconnect: carsToDisconnect.map((carId) => ({ id: carId })),
                            }, 
                            // Update passenger profiles
                            favorite_passengers: {
                                connect: ((_e = driverData.favorite_passengers) === null || _e === void 0 ? void 0 : _e.map((passengerId) => ({ id: passengerId }))) || [],
                                disconnect: passengersToDisconnect.map((passengerId) => ({ id: passengerId })),
                            }, 
                            // Update trips
                            trips: {
                                connect: ((_f = driverData.trips) === null || _f === void 0 ? void 0 : _f.map((tripId) => ({ id: tripId }))) || [],
                            } }),
                    });
                }
                else {
                    // If userId is not changed, just update other fields
                    yield transaction.driver_Profile.update({
                        where: { id },
                        data: Object.assign({}, updateData),
                    });
                }
                console.log(`Driver profile with ID ${id} has been updated.`);
            }));
        }
        catch (error) {
            console.error('Error updating driver profile:', error);
            return;
        }
    });
}
function deleteDriverProfile(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                // Check if the driver profile exists
                const driverProfile = yield transaction.driver_Profile.findUnique({
                    where: { id },
                });
                if (!driverProfile) {
                    console.error(`Driver profile with ID ${id} does not exist.`);
                    return;
                }
                // Disconnect favorite cars
                const carsToDisconnect = yield transaction.car.findMany({
                    where: {
                        drivers: {
                            some: { id },
                        },
                    },
                    select: { id: true },
                });
                for (const car of carsToDisconnect) {
                    yield transaction.car.update({
                        where: { id: car.id },
                        data: {
                            drivers: {
                                disconnect: { id },
                            },
                        },
                    });
                }
                // Delete trips associated with the driver
                yield transaction.trip.deleteMany({
                    where: {
                        driverId: id,
                    },
                });
                // Disconnect from passenger profiles
                const profilesToDisconnect = yield transaction.passenger_Profile.findMany({
                    where: {
                        favorite_drivers: {
                            some: { id },
                        },
                    },
                    select: { id: true },
                });
                for (const profile of profilesToDisconnect) {
                    yield transaction.passenger_Profile.update({
                        where: { id: profile.id },
                        data: {
                            favorite_drivers: {
                                disconnect: { id },
                            },
                        },
                    });
                }
                // Disconnect favorite passengers
                const passengersToDisconnect = yield transaction.passenger_Profile.findMany({
                    where: {
                        favorite_of_drivers: {
                            some: { id },
                        },
                    },
                    select: { id: true },
                });
                for (const passenger of passengersToDisconnect) {
                    yield transaction.passenger_Profile.update({
                        where: { id: passenger.id },
                        data: {
                            favorite_of_drivers: {
                                disconnect: { id },
                            },
                        },
                    });
                }
                // Delete the driver profile
                yield transaction.driver_Profile.delete({
                    where: { id },
                });
                console.log(`Driver profile with ID ${id} has been deleted.`);
            }));
        }
        catch (error) {
            console.error('Error deleting driver profile:', error);
            return;
        }
    });
}
