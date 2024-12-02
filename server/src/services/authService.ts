import { prisma } from '../models/prismaClient';
import { validateUsers } from '../models/validateUser';
import * as bcrypt from 'bcrypt';

async function registerUser(userData: any) {
  try {
    // Validate data
    validateUsers(userData);
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return await prisma.users.create({
      data: {
        ...userData,
        password: hashedPassword,
      }
    });
  } catch (error) {
    console.error('Failed to create user:', error, '\nPlease check the data and try again.');
    return;
  }
}

async function loginUser(username: string, password: string){
  try {
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user) {
      console.error('User not found.');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.error('Incorrect password.');
      return;
    }

    console.log(user.username,'authentificated succesfully')
    return user;
  } catch (error) {
    console.error('Login failed. Please check your credentials.');
    return;
  }
}

export { registerUser, loginUser };