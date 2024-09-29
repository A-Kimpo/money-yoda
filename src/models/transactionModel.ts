import { Model } from 'objection';

import { Wallet } from '@/models';
import { WalletService } from '@/services';

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
        tag: { type: 'string', nullable: true },
        category: { type: 'string', nullable: true },
        description: { type: 'string', nullable: true }
      }
    };
  }

  async $beforeInsert() {
    this.date_added = new Date();
  }

  async $beforeUpdate() {
    this.date_modified = new Date();
  }

  async $afterInsert() {
    const walletService = new WalletService();
    await walletService.updateBalance(this);
  }

  async $afterDelete() {
    const walletService = new WalletService();
    await walletService.updateBalance(this);
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
