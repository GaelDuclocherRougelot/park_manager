import CustomApiError from '@/errors/apiErrors';
import { NextFunction, Request, Response } from 'express';

export default function (schema: any) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const dataToValidate = req.body;

    try {
      await schema.validateAsync(dataToValidate);
      next();
    } catch (err) {
      if (err instanceof Error) {
        next(new CustomApiError(err.message, 400));
      }
    }
  };
};
