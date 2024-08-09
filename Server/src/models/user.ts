const sql = require('@/config/db.ts');
import CustomApiError from '@/errors/apiErrors';
import { UserWithHashedPassword } from '@/types/user';

export default {
  async findAllUsers() {
    const users = await sql`SELECT * FROM users`;
    return users;
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
    ("email", "firstname", "lastname", "hashed_password", "user_role")
    VALUES (${user.email}, ${user.firstname}, ${user.lastname}, ${user.hashed_password}, ${user.user_role})
    RETURNING *
`;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new CustomApiError(err.message, 400);
      }
    }
  },

  async updateUser(
    userData: { firstname: string; lastname: string },
    userId: number
  ) {
    try {
      await sql`
      UPDATE "users"
      SET firstname = COALESCE(NULLIF(${userData.firstname}, ''), firstname),
          lastname = COALESCE(NULLIF(${userData.lastname}, ''), lastname),
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
