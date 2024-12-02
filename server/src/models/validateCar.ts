import { prisma, Car } from './prismaClient';

interface Cars {
    id?: number;
    mark: string;
    model: string;
    capacity: number;
    isAutomatic: boolean;
    year: number;
    city: string;
    price: number;
    isAvailable: boolean;
}

const allFields: (keyof Cars)[] = [
    'mark',
    'model',
    'capacity',
    'isAutomatic',
    'year',
    'city',
    'price',
    'isAvailable',
];

const requiredFields: (keyof Cars)[] = [
    'mark',
    'model',
    'capacity',
    'isAutomatic',
    'year',
    'city',
    'price',
    'isAvailable',
];
const uniqueFields: (keyof Cars)[] = [];

const requiredUniqueFields: (keyof Cars)[] = [];


// Implementation of uniqueness functions in the database
async function isNotUnique(field: keyof Cars, value: any): Promise<boolean> {
    try {
        // Construct the 'where' clause using the dynamic field
        const whereClause: Record<string, any> = { [field]: value };

        const existingUser = await prisma.users.findUnique({
            where: whereClause as Car,
        });

        return existingUser !== null;
    } catch (error) {
        console.error(`Error checking "${field}" uniqueness:`, error);
        return false;
    }
}

async function validateCar(data: Partial<Cars>): Promise<void> {
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

async function validateCarUpdate(data: Partial<Cars>): Promise<void> {
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

export { validateCar, validateCarUpdate };