import customApiError from '@/errors/apiErrors';
import parkingDatamapper from '@/models/parking';
import adminDatamapper from '@/models/parking';
import { Request, Response } from 'express';

export default {
  async createParking(req: Request, res: Response) {
    try {
      await adminDatamapper.createParking(req.body, req.user.id);
      res.status(201).json(`Parking (${req.body.name}) successfuly created !`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },
  async getPaginatedParkings(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    try {
      const parkings = await parkingDatamapper.findAllParkings(page, pageSize);
      res.status(200).json({
        page,
        pageSize,
        parkings
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },
};
