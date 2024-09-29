import { Transaction, Wallet } from '@/models';

export default class WalletService {
  async getBalance(wallet_id: number) {
    const wallet = await Wallet.query().findById(wallet_id);
    if (!wallet) throw new Error('Wallet not found');

    const transactions = await Transaction.query().where('wallet_id', wallet_id);
    const balance = transactions.reduce((acc, { type, amount }) => {
      const _amount = {
        income: +amount,
        expense: -amount
      }[type];

      if (!_amount) {
        throw new Error('An unexpected error has occurred');
      }

      return acc + _amount;
    }, 0);

    return balance;
  }


  async updateBalance(transaction: Transaction) {
    const { wallet_id, type, amount } = transaction;

    // Check if the wallet exists
    const wallet = await Wallet.query().findById(wallet_id);
    if (!wallet) throw new Error('Wallet not found');

    // Calculate the new wallet balance
    const _amount = {
      income: +amount,
      expense: -amount
    }[type];

    if (!_amount) {
      throw new Error('Invalid transaction type');
    }

    const newBalance = wallet.balance + _amount;

    // Update the wallet balance
    await Wallet.query().updateAndFetchById(wallet_id, {
      ...wallet,
      balance: newBalance
    });

    return newBalance;
  }

  async getWalletById(id: number) {
    const wallet = await Wallet.query().findById(id);

    if (!wallet) throw new Error('Wallet not found');

    return wallet;
  }
}
