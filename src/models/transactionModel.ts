import { Model } from 'objection';
import { Wallet } from '@/models';

export default class Transaction extends Model {
  id!: number;
  wallet_id!: number;
  type!: string;
  amount!: number;
  tag?: string;
  description!: string;
  
  static get tableName() {
    return 'transactions';
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
