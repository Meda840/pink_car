import { prisma, Users } from './prismaClient';

interface User {
    id?: number,
    identity: string;
    username: string;
    password: string;
    email: string;
    phone_number: string;
    role: boolean;
}

const allFields: (keyof User)[] = [
    'id',
    'identity',
    'username',
    'password',
    'email',
    'phone_number',
    'role',
];

const requiredFields: (keyof User)[] = [
    'identity',
    'username',
    'password',
    'email',
    'phone_number',
];
const uniqueFields: (keyof User)[] = [ 'identity', 'username', 'email', 'phone_number' ];

const requiredUniqueFields: (keyof User)[] = [ 'identity', 'username', 'email', 'phone_number' ];


// Implementation of uniqueness functions in the database
async function isNotUnique(field: keyof User, value: any): Promise<boolean> {
    try {
        // Construct the 'where' clause using the dynamic field
        const whereClause: Record<string, any> = { [field]: value };

        const existingUser = await prisma.users.findUnique({
            where: whereClause as Users,
        });

        return existingUser !== null;
    } catch (error) {
        console.error(`Error checking "${field}" uniqueness:`, error);
        return false;
    }
}

// Check the data structure
async function validateUsers(data: Partial<User>): Promise<void> {
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
async function validateUsersUpdate(data: Partial<User>): Promise<void> {
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

export { validateUsers, validateUsersUpdate };