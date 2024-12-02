import { prisma } from '../models/prismaClient';
import { validateUsers, validateUsersUpdate } from '../models/validateUser';
import * as bcrypt from 'bcrypt';

// async function createUser(userData: any) {
//   try {
//     // Validate data
//     validateUsers(userData);

//     // Create new user
//     return await prisma.users.create({
//         data: userData,
//     });
//   } catch (error) {
//     console.error('Error creating user:', error, '\nPlease check the data and try again.');
//     return;
//   }
// }

async function getAllUsers() {
  try {
    return await prisma.users.findMany();
  } catch (error) {
    console.error('Error fetching all user');
    return;
  }
}

async function getUserById(userId: number) {
  try {
    return await prisma.users.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error('Error fetching user');
    return;
  }
}

async function updateUser(userId: number, updatedData: any) {
  try {
    // Validate data
    validateUsersUpdate(updatedData);

    // Hash the password if it is being updated
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    } else if (updatedData.password == '') {
      updatedData.password = null;
    }

    // update the user by ID
    return await prisma.users.update({
      where: { id: userId },
      data: updatedData,
    });
  } catch (error) {
    console.error('Error updating user');
    return;
  }
}

async function deleteUser(userId: number) {
  try {
    // Delete related Passenger_Profile if it exists
    await prisma.passenger_Profile.deleteMany({
      where: { userId: userId },
    });

    // Delete related Driver_Profile if it exists
    await prisma.driver_Profile.deleteMany({
      where: { userId: userId },
    });

    // Finally, delete the user
    await prisma.users.delete({
      where: { id: userId },
    });

    console.log(`User with ID ${userId} and related profiles have been deleted.`);
  } catch (error) {
    console.error('Error deleting user');
    return;
  }
}

// export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
export { getAllUsers, getUserById, updateUser, deleteUser };
