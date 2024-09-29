import { Transaction } from '@/models';

export default class TransactionService {
  async getTransactionById(id: number) {
    const transaction = await Transaction.query().findById(id);

    if (!transaction) throw new Error('Transaction not found');

    return transaction;
  }
  async deleteById(id: number) {
    return Transaction.query().deleteById(id);
  }
}
