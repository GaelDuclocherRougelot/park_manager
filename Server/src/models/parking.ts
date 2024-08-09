const sql = require('@/config/db.ts');
import CustomApiError from '@/errors/apiErrors';
import { Parking } from '@/types/parking';

export default {
  async createParking(parkingData: Parking, userId: number) {
    try {
      await sql`
    INSERT INTO "parking"
    ("name", "max_spaces", "max_floors", "address", "owner")
    VALUES (${parkingData.name}, ${parkingData.max_spaces}, ${parkingData.max_floors}, ${parkingData.address}, ${userId})
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
};
