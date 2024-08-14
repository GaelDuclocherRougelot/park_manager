const sql = require('@/config/db.ts');
import CustomApiError from '@/errors/apiErrors';
import { UserWithHashedPassword } from '@/types/user';

export default {
  async findAllParkingOwners() {
    const owners = await sql`SELECT id, fullname, user_role, updatedat, createdat, email FROM users WHERE "user_role" = 'admin'`;
    return owners;
  },

  async findUserByEmail(email: string) {
    try {
      const existingUser = await sql`
      SELECT * FROM "users" WHERE "email" = ${email}
    `;      
      return existingUser[0];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async findUserById(id: number) {
    try {
      const existingUser = await sql`
      SELECT * FROM "users" WHERE "id" = ${id}
    `;

      return existingUser[0];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async createUser(user: UserWithHashedPassword) {
    try {
      await sql`
    INSERT INTO "users"
    ("email", "fullname", "hashed_password", "user_role")
    VALUES (${user.email}, ${user.fullname}, ${user.hashed_password}, ${user.user_role})
    RETURNING *
`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async updateUser(
    userData: { fullname: string; lastname: string },
    userId: number
  ) {
    try {
      await sql`
      UPDATE "users"
      SET fullname = COALESCE(NULLIF(${userData.fullname}, ''), fullname),
          updatedat = NOW()
      WHERE "id" = ${userId}`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async deleteUser(userId: number) {
    try {
      await sql`
      UPDATE "space"
      SET space_owner = NULL
      WHERE "space_owner" = ${userId}
    `;

      await sql`
      DELETE FROM "users"
      WHERE "id" = ${userId}
    `;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },
};
