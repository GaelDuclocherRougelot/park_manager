import customApiError from '@/errors/apiErrors';
import userDatamapper from '@/models/user';
import { UserWithPassword } from '@/types/user';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const saltOrRounds = 10;

export default {
  async findAllParkingOwners(req: Request, res: Response) {
    const owners = await userDatamapper.findAllParkingOwners();
    return res.json(owners);
  },

  async findOneUserById(req: Request, res: Response) {
    if (!req.user.id) {
      res.status(400).json({ error: 'User not connected' });
      return;
    }
    const user = await userDatamapper.findUserById(req.user.id);
    return res.json(user);
  },

  async register(req: Request, res: Response) {
    const {
      email,
      fullname,
      password,
      user_role,
    }: UserWithPassword = req.body;
    try {
      const isExistingUser = await userDatamapper.findUserByEmail(email);      
      if (
        isExistingUser !== undefined &&
        Object.keys(isExistingUser).length !== 0 &&
        isExistingUser.constructor === Object
      ) {
        res.status(409).json({ error: 'Email already in use' });
        return;
      }

      const hashed_password = await bcrypt.hash(password, saltOrRounds);

      await userDatamapper.createUser({
        email: email,
        fullname: fullname,
        hashed_password: hashed_password,
        user_role: user_role,
      });

      res.status(200).json({
        message: `User successfully created !`,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const existingUser = await userDatamapper.findUserByEmail(email);
      if (!existingUser) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.hashed_password
      );

      if (!validPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const token = jwt.sign(
        { id: existingUser.id, role: existingUser.user_role },
        JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      res.status(200).json({ message: 'Login successful', token});
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },
  async updateProfile(req: Request, res: Response) {
    const userData = req.body;
    try {
      await userDatamapper.updateUser(userData, req.user.id);
      res.status(200).json({ message: 'Profile Updated' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async deleteProfile(req: Request, res: Response) {
    try {
      await userDatamapper.deleteUser(req.user.id);
      res.status(200).json(`User with id: ${req.user.id} deleted`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  }
};
