import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'unauthorized' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user.role !== 'admin') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};
