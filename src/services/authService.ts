import { argon2i } from 'argon2-ffi';

import { UserService } from '@/services';
import { isEmpty } from '@/utils';

export default class AuthService {
  async authUser(email: string, password: string) {
    if (isEmpty(email) || isEmpty(password))
      throw new Error('All fields must be fill');

    const userService = new UserService();

    const user = await userService.getUserByEmail(email);

    if (!user) throw new Error('User not found');

    await this.verifyPassword(user.password, password);

    return user;
  }

  verifyPassword(userPassword: string, password: string) {
    const verifyPassword = argon2i.verify(userPassword, password);

    if (!verifyPassword) throw new Error('Incorrect username or password');

    return verifyPassword;
  }
}
