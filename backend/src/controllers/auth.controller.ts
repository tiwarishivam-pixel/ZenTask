import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signupService(name, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginService(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Logout can just be handled on frontend by deleting token
export const logout = async (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
