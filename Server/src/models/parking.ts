const sql = require('@/config/db.ts');
import CustomApiError from '@/errors/apiErrors';
import { Parking, Space } from '@/types/parking';

export default {
  async createParking(parkingData: Parking, userId: number) {
    try {
      await sql`
    INSERT INTO "parking"
    ("name", "space_per_floor", "floors", "address", "owner")
    VALUES (${parkingData.name}, ${parkingData.space_per_floor}, ${parkingData.floors}, ${parkingData.address}, ${userId})
    RETURNING *
`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findLatestCreatedParking(userId: number) {
    try {
      const parking = await sql`SELECT *
        FROM "parking"
        WHERE owner = ${userId}
        ORDER BY id DESC
        LIMIT 1;`;
      return parking;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async updateParking(
    parkingData: { name: string; address: string },
    parkingId: string
  ) {
    try {
      await sql`
      UPDATE "parking"
      SET name = COALESCE(NULLIF(${parkingData.name}, ''), name),
          address = COALESCE(NULLIF(${parkingData.address}, ''), address),
          updatedat = NOW()
      WHERE "id" = ${parkingId}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async deleteParkingByPk(parkingId: string, userId: number) {
    try {
      await sql`DELETE FROM "parking" WHERE "id" = ${parkingId} AND "owner" = ${userId};
      `;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findAllParkingsByOwner(
    page: number,
    pageSize: number,
    ownerId: number
  ) {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    try {
      const parkings = await sql`SELECT
        p.*,
        COUNT(CASE WHEN s."space_owner" IS NULL THEN 1 END) AS "free_spaces",
        COUNT(CASE WHEN s."space_owner" IS NOT NULL THEN 1 END) AS "reserved_spaces"
    FROM
        "parking" p
    LEFT JOIN
        "space" s ON p."id" = s."parking"
    WHERE
        p."owner" = ${ownerId}
    GROUP BY
        p."id"
    ORDER BY
        p."createdat" DESC
    LIMIT ${limit}
    OFFSET ${offset};`;
      return parkings;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findFreeSpacePerFloor(
    floor: number,
    parkingId: string
  ) {


    try {
      const freeSpaces = await sql`SELECT * 
        FROM "space" 
        WHERE "space_owner" IS NULL 
        AND "floor" = ${floor}
        AND "parking" = ${parkingId}
        ORDER BY space_number ASC`;

      return freeSpaces;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findMySpaces(userId: number) {
    try {
      const currentSpaces =
        await sql`SELECT * FROM "space" WHERE "space_owner" = ${userId}`;
      return currentSpaces;
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

  async findParkingsByOwner(userId: number) {
    try {
      const parking = await await sql`
      SELECT
        p.*,
        COUNT(CASE WHEN s."space_owner" IS NULL THEN 1 END) AS "free_spaces",
        COUNT(CASE WHEN s."space_owner" IS NOT NULL THEN 1 END) AS "reserved_spaces",
        (COUNT(CASE WHEN s."space_owner" IS NOT NULL THEN 1 END) * 100.0 / NULLIF(COUNT(s."id"), 0)) AS "occupation_rate"
      FROM "parking" p
      LEFT JOIN "space" s ON p."id" = s."parking"
      WHERE p.owner = ${userId}
      GROUP BY p."id";
    `;
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

  async assignUserToOneSpace(userId: number, spaceId: string) {
    try {
      await sql`
      UPDATE "space"
      SET space_owner = COALESCE(${userId}, space_owner),
          occupation_time = NOW(),
          updatedat = NOW()
      WHERE "id" = ${spaceId}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },
  async unassignUserToOneSpace(userId: number, spaceId: string) {
    try {
      await sql`
      UPDATE "space"
      SET space_owner = NULL,
          occupation_time = NULL,
          updatedat = NOW()
      WHERE "id" = ${spaceId}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },
};
