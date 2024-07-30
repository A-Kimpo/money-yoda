import { Model } from 'objection';
import { argon2i } from 'argon2-ffi';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import config from '@/config';

export default class User extends Model {
  id!: number;
  username!: string;
  password!: string;
  is_admin!: boolean;
  email!: string;
  date_added!: Date;
  date_modified!: Date;

  static get tableName() {
    return 'users';
  }

  async $beforeInsert() {
    const salt = crypto.randomBytes(32);
    const hash = await argon2i.hash(this.password, salt);
    this.username = this.username.toLocaleLowerCase();
    this.password = hash;
    this.date_added = new Date();
  }

  async $beforeUpdate() {
    if (this.username) this.username = this.username.toLocaleLowerCase();
    if (this.password) {
      const salt = crypto.randomBytes(32);
      const hash = await argon2i.hash(this.password, salt);
      this.password = hash;
    }
    this.date_modified = new Date();
  }

  getAccessToken() {
    return jwt.sign(
      {
        username: 'this.username',
        user_id: 'this.id'
      },
      config.jwt.refresh_token_secret,
      {
        expiresIn: config.jwt.access_token_expiration
      }
    );
  }

  getRefreshToken() {
    return jwt.sign(
      {
        username: 'this.username',
        user_id: 'this.id'
      },
      config.jwt.refresh_token_secret,
      {
        expiresIn: config.jwt.refresh_token_expiration
      }
    );
  }

  verifyPassword(password: string) {
    return argon2i.verify(this.password, password);
  }
}
