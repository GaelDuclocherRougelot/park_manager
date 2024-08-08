import userDatamapper from '../models/user';

export default {

  async findAllUsers(req: any, res: { json: (arg0: any) => any; }) {
    const users = await userDatamapper.findAllUsers();
    return res.json(users);
  }

}