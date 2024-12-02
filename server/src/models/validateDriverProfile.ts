import { prisma, Driver_Profile } from './prismaClient';

interface DriverProfile {
    id?: number;
    userId: number;
    drivingLicence: string;
    photo?: string;
    biography?: string;
    location: string;
    favorite_cars?: number[];
    favorite_passengers?: number[];
    trips?: number[];
}

const allFields: (keyof DriverProfile)[] = [
    'id',
    'userId',
    'drivingLicence',
    'photo',
    'biography',
    'location',
    'favorite_cars',
    'favorite_passengers',
    'trips',
];
const uniqueFields: (keyof DriverProfile)[] = [ 'userId' ];

const requiredFields: (keyof DriverProfile)[] = [ 'userId', 'drivingLicence', 'location' ];
const requiredUniqueFields: (keyof DriverProfile)[] = [ 'userId' ];

// Implementation of uniqueness functions in the database
async function isNotUnique(field: keyof DriverProfile, value: any): Promise<boolean> {
    try {
        const existingUser = await prisma.driver_Profile.findUnique({
            where: {
                [field]: value,
            } as Driver_Profile,
        });

        return existingUser ? true : false;
    } catch (error) {
        console.error(`Error checking "${field}" uniqueness:`, error);
        return false;
    }
}


// Check the data structure
async function validateDriverProfile(data: Partial<DriverProfile>): Promise<void> {
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

// Check the data structure
async function validateDriverProfileUpdate(data: Partial<DriverProfile>): Promise<void> {
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

export { validateDriverProfile , validateDriverProfileUpdate, DriverProfile };