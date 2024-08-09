const sql = require('@/config/db.ts');
import CustomApiError from '@/errors/apiErrors';
import { Parking, Space } from '@/types/parking';

export default {
  async createParking(parkingData: Parking, userId: number) {
    try {
      await sql`
    INSERT INTO "parking"
    ("name", "max_spaces", "max_floors", "address", "owner")
    VALUES (${parkingData.name}, ${parkingData.space_per_floor}, ${parkingData.space_per_floor}, ${parkingData.address}, ${userId})
    RETURNING *
`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findAllParkings(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
      const parkings =
        await sql`SELECT * FROM "parking" ORDER BY createdat DESC LIMIT ${limit} OFFSET ${offset}`;
      return parkings;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findParkingByPk(parkingId: string) {
    try {
      const parking =
        await sql`SELECT * FROM "parking" WHERE "id" = ${parkingId}`;
      return parking;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async createParkingSpaces(space: Space) {
    try {
      await sql`
    INSERT INTO "space"
    ("space_number", "floor", "occupation_time", "space_owner", "parking")
    VALUES (${space.space_number}, ${space.floor}, ${space.occupation_time}, null, ${space.parking})
    RETURNING *
`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },
};
