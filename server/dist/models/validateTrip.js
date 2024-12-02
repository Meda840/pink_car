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
exports.validateTrip = validateTrip;
exports.validateTripUpdate = validateTripUpdate;
const prismaClient_1 = require("./prismaClient");
// Define all fields in the Trip model
const allFields = [
    'id',
    'start',
    'destination',
    'price',
    'numberPassengers',
    'description',
    'driverId',
    'passengerId',
];
// Define fields that must be unique
const uniqueFields = [];
// Define required fields
const requiredFields = ['start', 'destination', 'driverId', 'passengerId'];
// Define required unique fields
const requiredUniqueFields = [];
// Implementation of uniqueness check in the database
function isNotUnique(field, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existingTrip = yield prismaClient_1.prisma.trip.findFirst({
                where: {
                    [field]: value,
                },
            });
            return existingTrip ? true : false;
        }
        catch (error) {
            console.error(`Error checking "${field}" uniqueness:`, error);
            return false;
        }
    });
}
// Validate the data structure for creating a Trip
function validateTrip(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const field of allFields) {
            // Check if the field is required
            if (requiredFields.includes(field)) {
                // Check if any of the required fields is undefined or null
                if (data[field] === undefined || data[field] === null) {
                    console.error(`Field "${field}" is required and cannot be null or undefined`);
                    return;
                }
                // Check the required unique fields
                else if (requiredUniqueFields.includes(field)) {
                    // Check if any of the required unique fields is undefined or null
                    if (data[field] === undefined || data[field] === null) {
                        console.error(`Field "${field}" is required and cannot be null or undefined`);
                        return;
                    }
                    // Check the uniqueness of requiredUniqueFields
                    if (yield isNotUnique(field, data[field])) {
                        console.error(`Field "${field}" must be unique`);
                        return;
                    }
                }
            }
            // Check if any of the defined fields is null
            else if (data[field] !== undefined) {
                if (data[field] === null) {
                    console.error(`Field "${field}" cannot be null`);
                    return;
                }
                // Check the unique fields
                if (uniqueFields.includes(field)) {
                    // Check the uniqueness of uniqueFields
                    if (yield isNotUnique(field, data[field])) {
                        console.error(`Field "${field}" must be unique`);
                        return;
                    }
                }
            }
        }
    });
}
// Validate the data structure for updating a Trip
function validateTripUpdate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const field of allFields) {
            // If the field is provided in data, check its validity
            if (data[field] !== undefined) {
                // Check if the field is null
                if (data[field] === null) {
                    console.error(`Field "${field}" cannot be null`);
                    return;
                }
                // Check for uniqueness if the field is marked as unique
                if (uniqueFields.includes(field)) {
                    if (yield isNotUnique(field, data[field])) {
                        console.error(`Field ${field} must be unique`);
                        return;
                    }
                }
            }
        }
    });
}