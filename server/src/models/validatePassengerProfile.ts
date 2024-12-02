import { prisma, Passenger_Profile } from './prismaClient';

interface PassengerProfile {
    id?: number;
    userId: number;
    photo?: string;
    biography?: string;
    favorite_drivers?: number[];
    trips?: number[];
}

const allFields: (keyof PassengerProfile)[] = [
    'id',
    'userId',
    'photo',
    'biography',
    'favorite_drivers',
    'trips',
];
const uniqueFields: (keyof PassengerProfile)[] = ['userId'];

const requiredFields: (keyof PassengerProfile)[] = ['userId'];
const requiredUniqueFields: (keyof PassengerProfile)[] = ['userId'];

// Implementation of uniqueness functions in the database
async function isNotUnique(field: keyof PassengerProfile, value: any): Promise<boolean> {
    try {
        const existingProfile = await prisma.passenger_Profile.findUnique({
            where: {
                [field]: value,
            } as Passenger_Profile,
        });

        return existingProfile ? true : false;
    } catch (error) {
        console.error(`Error checking "${field}" uniqueness:`, error);
        return false;
    }
}

// Check the data structure
async function validatePassengerProfile(data: Partial<PassengerProfile>): Promise<void> {
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

// Check the data structure for updates
async function validatePassengerProfileUpdate(data: Partial<PassengerProfile>): Promise<void> {
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

export { validatePassengerProfile, validatePassengerProfileUpdate, PassengerProfile };
