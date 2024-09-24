import { Model } from 'objection';
import { Wallet } from '@/models';

export default class Transaction extends Model {
  id!: number;
  wallet_id!: number;
  type!: string;
  amount!: number;
  tag?: string;
  category?: string;
  description?: string;
  date_added!: Date;
  date_modified!: Date;
  
  static get tableName() {
    return 'transactions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['wallet_id', 'type', 'amount'],
      properties: {
        id: { type: 'integer' },
        wallet_id: { type: 'integer' },
        type: { type: 'string' },
        amount: { type: 'number' },
        tag: { type: 'string' },
        category: { type: 'string' },
        description: { type: 'string' },
        date_added: { type: 'string' },
        date_modified: { type: 'string' }
      }
    };
  }

  async $beforeInsert() {
    this.date_added = new Date();
  }

  async $beforeUpdate(context: any) {
    this.date_modified = new Date();
  }

  static get relationMappings() {
    return {
      wallet: {
        relation: Model.BelongsToOneRelation,
        modelClass: Wallet,
        join: {
          from: 'transactions.wallet_id',
          to: 'wallets.id'
        }
      }
    };
  }
}
