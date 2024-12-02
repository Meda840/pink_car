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
exports.createTrip = createTrip;
exports.getAllTrips = getAllTrips;
exports.getTripById = getTripById;
exports.updateTrip = updateTrip;
exports.deleteTrip = deleteTrip;
const prismaClient_1 = require("../models/prismaClient");
const validateTrip_1 = require("../models/validateTrip");
function createTrip(tripData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, validateTrip_1.validateTrip)(tripData);
            const newTrip = yield prismaClient_1.prisma.trip.create({
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
        }
        catch (error) {
            console.error('Error creating trip:', error);
            return null;
        }
    });
}
function getAllTrips() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.trip.findMany({
                include: {
                    driver: true,
                    passenger: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching all trips:', error);
            return [];
        }
    });
}
function getTripById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.trip.findUnique({
                where: { id },
                include: {
                    driver: true,
                    passenger: true,
                },
            });
        }
        catch (error) {
            console.error('Error fetching trip:', error);
            return null;
        }
    });
}
function updateTrip(id, tripData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, validateTrip_1.validateTripUpdate)(tripData);
            if (tripData.driverId) {
                // Check if the driver and passenger exist before updating
                const driverExists = yield prismaClient_1.prisma.driver_Profile.findUnique({
                    where: { id: tripData.driverId },
                });
                if (!driverExists) {
                    console.error(`Driver with ID ${tripData.driverId} does not exist.`);
                    return;
                }
            }
            if (tripData.passengerId) {
                const passengerExists = yield prismaClient_1.prisma.passenger_Profile.findUnique({
                    where: { id: tripData.passengerId },
                });
                if (!passengerExists) {
                    console.error(`Passenger with ID ${tripData.passengerId} does not exist.`);
                    return;
                }
            }
            // Update the trip
            yield prismaClient_1.prisma.trip.update({
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
        }
        catch (error) {
            console.error('Error updating trip:', error);
            return;
        }
    });
}
function deleteTrip(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.prisma.trip.delete({
                where: { id },
            });
            console.log(`Trip with ID ${id} has been deleted.`);
        }
        catch (error) {
            console.error('Error deleting trip:', error);
            return;
        }
    });
}
