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
      const latestCreatedParking = await adminDatamapper.findLatestCreatedParking(req.user.id);
      
        // Récupération des détails du parking
        const parkingData = await parkingDatamapper.findParkingByPk(latestCreatedParking[0].id);
        const parking = parkingData[0];
  
        // Vérification que le parking existe
        if (!parking) {
          return res.status(404).json({ error: 'Parking not found' });
        }
  
        // Vérification que l'utilisateur est bien le propriétaire du parking
        if (parking.owner !== req.user.id) {
          return res.status(403).json({ error: 'Wrong parking owner' });
        }
  
        const spaces = [];
        let spaceCounter = 1;
  
        // Parcours des étages du parking
        for (let floor = 0; floor <= parking.floors; floor++) {
          // Parcours des places pour chaque étage
          for (
            let spaceNumber = 1;
            spaceNumber <= parking.space_per_floor;
            spaceNumber++
          ) {
            // Création de l'espace de la place
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
      await adminDatamapper.deleteParkingByPk(
        req.params.parkingId,
        req.user.id
      );
      res.status(200).json('Parking successfully deleted');
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new customApiError(err.message, 400);
      }
    }
  },

  async getPaginatedParkingsByOnwer(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const ownerId = parseInt(req.query.owner as string);

    try {
      const parkings = await parkingDatamapper.findAllParkingsByOwner(
        page,
        pageSize,
        ownerId
      );
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
    const floor = parseInt(req.query.floor as string) || 0;
    const parkingId = req.params.parkingId;

    try {
      const spaces = await parkingDatamapper.findFreeSpacePerFloor(
        floor,
        parkingId
      );
      res.status(200).json({
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

  async createSpaces(req: Request, res: Response, parkingId: any) {

    try {
      // Récupération des détails du parking
      const parkingData = await parkingDatamapper.findParkingByPk(parkingId);
      const parking = parkingData[0];

      // Vérification que le parking existe
      if (!parking) {
        return res.status(404).json({ error: 'Parking not found' });
      }

      // Vérification que l'utilisateur est bien le propriétaire du parking
      if (parking.owner !== req.user.id) {
        return res.status(403).json({ error: 'Wrong parking owner' });
      }

      const spaces = [];
      let spaceCounter = 1;

      // Parcours des étages du parking
      for (let floor = 0; floor <= parking.floors; floor++) {
        // Parcours des places pour chaque étage
        for (
          let spaceNumber = 1;
          spaceNumber <= parking.space_per_floor;
          spaceNumber++
        ) {
          // Création de l'espace de la place
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

      res.status(200).json({
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
