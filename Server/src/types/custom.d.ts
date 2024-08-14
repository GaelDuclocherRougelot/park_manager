import { UserWithHashedPassword } from './user';

declare global {
  namespace Express {
    interface Request {
      user: string | jwt.JwtPayload | undefined | UserWithHashedPassword
    }
  }
}