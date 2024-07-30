import { Model } from 'objection';
import { UAParser } from 'ua-parser-js';
import jwt from 'jsonwebtoken';

import { User } from '@/models';
import config from '@/config';

export default class Token extends Model {
  id!: number;
  user_id!: number;
  access_token!: string;
  refresh_token!: string;
  ua!: string;
  date_added!: Date;
  date_modified!: Date;

  static get tableName() {
    return 'tokens';
  }

  async $beforeInsert() {
    this.date_added = new Date();
  }

  async $beforeUpdate(context: any) {
    this.date_modified = new Date();
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tokens.user_id',
          to: 'users.id'
        }
      }
    };
  }

  verifyAccessToken(option = {}) {
    return jwt.verify(
      this.access_token,
      config.jwt.access_token_secret,
      option
    );
  }

  verifyRefreshToken(option = {}) {
    return jwt.verify(
      this.refresh_token,
      config.jwt.refresh_token_secret,
      option
    );
  }

  async getUA(ua: any) {
    const parser = new UAParser();
    parser.setUA(ua);
    const agent = parser.getResult();
    return JSON.stringify({ ...agent });
  }
}
