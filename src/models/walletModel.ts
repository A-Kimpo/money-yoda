import { Model } from 'objection';
import { User } from '@/models';

export default class Wallet extends Model {
  id!: number;
  user_id!: number;
  name!: string;
  balance!: number;

  static get tableName() {
    return 'wallets';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'name'],
      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        name: { type: 'string' },
        balance: { type: 'number' }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'wallets.user_id',
          to: 'users.id'
        }
      }
    };
  }
}
