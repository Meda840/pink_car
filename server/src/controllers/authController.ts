import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const newUser = await registerUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user. Please check the data and try again.' });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const newUser = await loginUser(req.body.username, req.body.password);
      res.status(200).json(newUser);
    } catch (error) {
      res.status(401).json({ error: 'Login failed. Please check your credentials.' });
    }
  }
}

export default new AuthController();