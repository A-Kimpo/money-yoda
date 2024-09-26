import { Transaction, Wallet } from '@/models';

export default class WalletService {
  async getBalance(walletId: number) {
    const wallet = await Wallet.query().findById(walletId);
    if (!wallet) throw new Error('Wallet not found');

    return wallet.balance;
  }

  async updateBalance(
    wallet: Wallet,
    transaction: Transaction,
    operation: string
  ) {
    const { wallet_id, type, amount } = transaction;

    const amountByOperation: Record<string, number> = {
      add: +amount,
      delete: -amount
    };

    // Calculate the new wallet balance
    const resultByType: Record<string, number> = {
      income: wallet.balance + amountByOperation[operation],
      expense: wallet.balance - amountByOperation[operation]
    };
    const newBalance = resultByType[type];

    // Update the wallet balance
    await Wallet.query().updateAndFetchById(wallet_id, {
      ...wallet,
      balance: newBalance
    });

    return newBalance;
  }
}
