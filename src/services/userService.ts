import { User } from '@/models';
import { Token } from '@/models';

export default class UserService {
  async getAllUsers() {
    const users = await User.query();

    if (!users) throw new Error('Users not found');

    return users.map((user) => {
      const { password, ...restData } = user;
      return restData;
    });
  }
  async getUserById(id: number | string) {
    const user = await User.query().findById(id);

    if (!user) throw new Error('User not found');

    const { password, ...restData } = user;

    return restData;
  }
  async getUserByEmail(email: string) {
    const user = await User.query().findOne({ email });

    if (!user) throw new Error('User not found');

    return User.query().findOne({ email });
  }
  async getUserByToken(token: Token) {
    return User.query().findOne({
      id: token.user_id
    });
  }
  async checkExistUser({ email, username }: User) {
    const user = await User.query().where({ email, username });

    return !!user.length;
  }
  async createUser(user: User) {
    return User.query().insertAndFetch(user);
  }
  async deleteUser(id: number | string) {
    const user = await this.getUserById(id);

    if (user.is_admin) throw new Error('Admin cannot be deleted');

    return User.query().deleteById(id);
  }
}
