import { Model } from 'objection';
import { User } from '@/models';

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
}
