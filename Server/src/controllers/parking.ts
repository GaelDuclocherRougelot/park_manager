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

  async findParkingsByOwner(req: Request, res: Response) {
    try {
      const parkings = await adminDatamapper.findParkingsByOwner(req.user.id);
      res.status(200).json(parkings);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async updateParking(req: Request, res: Response) {
    try {
      await adminDatamapper.updateParking(req.body, req.params.parkingId);
      res.status(200).json('Parking successfully updated');
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async deleteParkingByPk(req: Request, res: Response) {
    try {
      await adminDatamapper.deleteParkingByPk(req.params.parkingId, req.user.id);
      res.status(200).json('Parking successfully deleted');
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

  async findAllFreeSpacesPerFloor(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const floor = req.params.floor;
    try {
      const spaces = await parkingDatamapper.findFreeSpacePerFloor(
        page,
        pageSize,
        floor
      );
      res.status(200).json({
        page,
        pageSize,
        spaces,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async findMySpaces(req: Request, res: Response) {
    try {
      const spaces = await parkingDatamapper.findMySpaces(req.user.id);
      res.status(200).json(spaces);
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

      if (!parking) {
        return res.status(404).json({ error: 'Parking not found' });
      }

      if (parking.owner !== req.user.id) {
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

      res.status(201).json({
        message: `${spaces.length} spaces created successfully!`,
        spaces,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      }
    }
  },

  async assignUserToOneSpace(req: Request, res: Response) {
    try {
      await parkingDatamapper.assignUserToOneSpace(
        req.user.id,
        req.params.spaceId
      );
      res.status(200).json('User successfully assigned to the space');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      }
    }
  },
  async unassignUserToOneSpace(req: Request, res: Response) {
    try {
      await parkingDatamapper.unassignUserToOneSpace(
        req.user.id,
        req.params.spaceId
      );
      res.status(200).json('User successfully unassigned from the space');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      }
    }
  },
};
