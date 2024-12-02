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
exports.createCar = createCar;
exports.getAllCars = getAllCars;
exports.getCarById = getCarById;
exports.updateCar = updateCar;
exports.deleteCar = deleteCar;
const prismaClient_1 = require("../models/prismaClient");
const validateCar_1 = require("../models/validateCar");
function createCar(carData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate data fields
        (0, validateCar_1.validateCar)(carData);
        try {
            return yield prismaClient_1.prisma.car.create({
                data: carData,
            });
        }
        catch (error) {
            console.error('Error creating car:', error, '\nPlease check the data and try again.');
            return;
        }
    });
}
function getAllCars() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.car.findMany();
        }
        catch (error) {
            console.error('Error fetching all car');
            return;
        }
    });
}
function getCarById(carId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prismaClient_1.prisma.car.findUnique({
                where: { id: carId },
            });
        }
        catch (error) {
            console.error('Error fetching car');
            return;
        }
    });
}
function updateCar(carId, carData) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate data fields
        (0, validateCar_1.validateCarUpdate)(carData);
        try {
            return yield prismaClient_1.prisma.car.update({
                where: { id: carId },
                data: carData,
            });
        }
        catch (error) {
            console.error('Error updating car');
            return;
        }
    });
}
function deleteCar(carId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prismaClient_1.prisma.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                // Find all drivers associated with the car
                const driversToDisconnect = yield transaction.driver_Profile.findMany({
                    where: {
                        favorite_cars: {
                            some: { id: carId },
                        },
                    },
                    select: { id: true },
                });
                // Disconnect the car from each driver
                for (const driver of driversToDisconnect) {
                    yield transaction.driver_Profile.update({
                        where: { id: driver.id },
                        data: {
                            favorite_cars: {
                                disconnect: { id: carId },
                            },
                        },
                    });
                }
                // Check if the car exists before attempting to delete
                const carExists = yield transaction.car.findUnique({
                    where: { id: carId },
                });
                if (!carExists) {
                    console.error(`Car with ID ${carId} does not exist.`);
                    return;
                }
                // Delete the car
                yield transaction.car.delete({
                    where: { id: carId },
                });
                console.log(`Car with ID ${carId} has been deleted.`);
            }));
        }
        catch (error) {
            console.error('Error deleting car:', error);
        }
    });
}
