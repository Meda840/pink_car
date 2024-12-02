import { Request, Response } from 'express';
// import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../services/userService';

class userController {
  // async createUser(req: Request, res: Response) {
  //   try {
  //     const newUser = await createUser(req.body);
  //     res.status(201).json(newUser);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Error creating user' });
  //   }
  // }

  async getAllUsers(req: Request, res: Response) {
    try {
      const allUsers = await getAllUsers();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching all users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      const user = await getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      const updatedUser = await updateUser(userId, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    try {
      await deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }
}

export default new userController();
