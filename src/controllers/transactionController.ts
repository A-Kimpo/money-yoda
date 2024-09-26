import e, { Request, Response } from 'express';
import { Wallet, Transaction } from '@/models';
import { WalletService } from '@/services';
import { convertToDate } from '@/utils';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { query } = req;

    const page = (parseInt(query.page as string) || 1) - 1;
    const perPage = parseInt(query.perPage as string) || 10;

    const transactions = await Transaction.query().page(page, perPage);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const getTransactionsByTag = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const { tag } = req.params;

    const page = (parseInt(query.page as string) || 1) - 1;
    const perPage = parseInt(query.perPage as string) || 10;

    const transactions = await Transaction.query()
      .page(page, perPage)
      .where('tag', tag);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions by tag' });
  }
};

export const deleteTransactionTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the transaction exists
    const transaction = await Transaction.query().findById(id);

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Update the transaction in the database
    const updatedTransaction = await Transaction.query().updateAndFetchById(
      id,
      { ...transaction, tag: '' }
    );

    if (updatedTransaction) {
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not updated' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.nativeError?.sqlMessage || error.message
    });
  }
};
export const getTransactionsByWallet = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const { wallet_id } = req.params;

    const page = (parseInt(query.page as string) || 1) - 1;
    const perPage = parseInt(query.perPage as string) || 10;

    const transactions = await Transaction.query()
      .page(page, perPage)
      .where('wallet_id', wallet_id);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions by wallet' });
  }
};
export const getTransactionsByType = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { query } = req;

    const page = (parseInt(query.page as string) || 1) - 1;
    const perPage = parseInt(query.perPage as string) || 10;

    const transactions = await Transaction.query()
      .page(page, perPage)
      .where('type', type);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.query().findById(id);

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
    } else {
      res.json(transaction);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const { startRange, endRange } = req.body;
    const { query } = req;

    const page = (parseInt(query.page as string) || 1) - 1;
    const perPage = parseInt(query.perPage as string) || 10;

    const dates = convertToDate([startRange, endRange]);

    const transactions = await Transaction.query()
      .page(page, perPage)
      .whereBetween('date_added', [dates[0], dates[1]]);

    if (!transactions) {
      res.status(404).json({ message: 'Transaction not found' });
    } else {
      res.json(transactions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { wallet_id, amount, type } = req.body;

    // Check if the wallet exists
    const wallet = await Wallet.query().findById(wallet_id);

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    // Add the new transaction to the database
    const transaction = await Transaction.query().insert({
      ...req.body,
      type,
      wallet_id: +wallet.id,
      amount: +amount
    });

    // Update the wallet balance
    const walletService = new WalletService();
    await walletService.updateBalance(wallet, transaction, 'add');

    res.json(transaction);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.nativeError?.sqlMessage || error.message
    });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Check if the transaction exists
    const transaction = await Transaction.query().findById(id);

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Update the transaction in the database
    const updatedTransaction = await Transaction.query().updateAndFetchById(
      id,
      { ...transaction, ...req.body }
    );

    if (updatedTransaction) {
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not updated' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.nativeError?.sqlMessage || error.message
    });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the transaction exists
    const transaction = await Transaction.query().findById(id);

    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Check if the wallet exists
    const wallet = await Wallet.query().findById(transaction.wallet_id);

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    // Update the wallet balance
    const walletService = new WalletService();
    await walletService.updateBalance(wallet, transaction, 'delete');

    // Delete the transaction from the database
    await Transaction.query().deleteById(id);

    res.json({ message: 'Transaction deleted' });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.nativeError?.sqlMessage || error.message });
  }
};
