const sql = require('../config/db.ts');

export default {
  async findAllUsers() {
    const result = await sql`select * from users`;
    return result;
  },
};
