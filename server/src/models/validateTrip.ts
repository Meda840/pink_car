import { prisma, Trip } from './prismaClient';

// Define the Trip interface
interface TripData {
  id?: number;
  start: string;
  destination: string;
  price?: number;
  numberPassengers?: number;
  description?: string;
  driverId: number;
  passengerId: number;
}

// Define all fields in the Trip model
const allFields: (keyof TripData)[] = [
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
const uniqueFields: (keyof TripData)[] = [];

// Define required fields
const requiredFields: (keyof TripData)[] = ['start', 'destination', 'driverId', 'passengerId'];

// Define required unique fields
const requiredUniqueFields: (keyof TripData)[] = [];

// Implementation of uniqueness check in the database
async function isNotUnique(field: keyof TripData, value: any): Promise<boolean> {
    try {
        const existingTrip = await prisma.trip.findFirst({
        where: {
            [field]: value,
        } as Trip,
        });

        return existingTrip ? true : false;
    } catch (error) {
        console.error(`Error checking "${field}" uniqueness:`, error);
        return false;
    }
}

// Validate the data structure for creating a Trip
async function validateTrip(data: Partial<TripData>): Promise<void> {
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
                if (await isNotUnique(field, data[field])) {
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
                if (await isNotUnique(field, data[field])) {
                    console.error(`Field "${field}" must be unique`);
                    return;
                }
            }
        }
    }
}

// Validate the data structure for updating a Trip
async function validateTripUpdate(data: Partial<TripData>): Promise<void> {
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
                if (await isNotUnique(field, data[field])) {
                    console.error(`Field ${field} must be unique`);
                    return;
                }
            }
        }
    }
}

export { validateTrip, validateTripUpdate, TripData };
