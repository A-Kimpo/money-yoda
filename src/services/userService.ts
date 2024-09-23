import { Request } from 'express';
import { isEmpty } from '@/utils';

import { User } from '@/models';
import { Token } from '@/models';

export default class UserService {
  async getUserByEmail(email: string) {
    return User.query().findOne({ email });
  }
  async getUserByToken(user_token: Token) {
    return User.query().findOne({
      id: user_token.user_id
    })
  };
}