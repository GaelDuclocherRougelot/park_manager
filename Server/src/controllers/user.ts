import customApiError from '@/errors/apiErrors';
import userDatamapper from '@/models/user';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserWithPassword } from 'types/user';

const saltOrRounds = 10;

export default {
  async findAllUsers(req: Request, res: Response) {
    const users = await userDatamapper.findAllUsers();
    return res.json(users);
  },

  async register(req: Request, res: Response) {
    const { email, firstname, lastname, password, user_role }: UserWithPassword =
      req.body;

    try {
      const existingUser = await userDatamapper.findUserByEmail(email);
      if (existingUser.length > 0) {
        res.status(409).json({ error: 'Email already in use' });
        return;
      }

      if (!email || !password || !firstname || !lastname || !user_role) {
        res.status(400).json({ error: 'All inputs are required' });
        return;
      }

      const hashed_password = await bcrypt.hash(password, 10);

      await userDatamapper.createUser({
        email: email,
        firstname: firstname,
        lastname: lastname,
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
};
