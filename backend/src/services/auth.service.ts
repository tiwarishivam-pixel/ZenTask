import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const signupService = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('User already exists');

  const user = new User({ name, email, password });
  await user.save();

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid email or password');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  return { user, token };
};
