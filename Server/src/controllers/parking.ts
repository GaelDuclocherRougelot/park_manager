import customApiError from '@/errors/apiErrors';
import {
  default as adminDatamapper,
  default as parkingDatamapper,
} from '@/models/parking';
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
        parkings,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async createSpaces(req: Request, res: Response) {
    const { parkingId } = req.params;

    try {
      // Récupération des détails du parking
      const parkingData = await parkingDatamapper.findParkingByPk(parkingId);
      const parking = parkingData[0];
      console.log(parking);

      if (!parking) {
        return res.status(404).json({ error: 'Parking not found' });
      }

      if (parking.owner !== req.user.id) {
        console.log(parking);

        return res.status(404).json({ error: 'Wrong parking owner' });
      }

      const spaces = [];
      let spaceCounter = 1;

      for (let floor = 0; floor < parking.floors; floor++) {
        for (
          let spaceNumber = 1;
          spaceNumber <= parking.space_per_floor;
          spaceNumber++
        ) {
          const space = await parkingDatamapper.createParkingSpaces({
            space_number: spaceCounter,
            floor,
            occupation_time: null,
            space_owner: null,
            parking: parking.id,
          });
          spaces.push(space);
          spaceCounter++;
        }
      }

      res
        .status(201)
        .json({
          message: `${spaces.length} spaces created successfully!`,
          spaces,
        });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      }
    }
  },
};
