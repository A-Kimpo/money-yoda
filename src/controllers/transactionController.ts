import { Request, Response } from 'express';

import { Transaction } from '@/models';
import { TransactionService, WalletService } from '@/services';
import { paginate, filterByQuery } from '@/utils';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { page, perPage, ...restQuery } = req.query;

    const queryBuilder = Transaction.query();

    filterByQuery(restQuery, queryBuilder);
    paginate({ page, perPage }, queryBuilder)

    const transactions = await queryBuilder;

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transactionService = new TransactionService();

    const transaction = await transactionService.getTransactionById(+id);

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { wallet_id, amount, type } = req.body;
    const walletService = new WalletService();

    // Check if the wallet exists
    const wallet = await walletService.getWalletById(wallet_id);

    // Add the new transaction to the database
    const transaction = await Transaction.query().insert({
      ...req.body,
      type,
      wallet_id: +wallet.id,
      amount: +amount
    });

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
    const { id } = req.params;
    const transactionService = new TransactionService();

    // Check if the transaction exists
    const transaction = await transactionService.getTransactionById(+id);

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
    const transactionService = new TransactionService();
    const walletService = new WalletService();

    // Check if the transaction exists
    const transaction = await transactionService.getTransactionById(+id);

    // Check if the wallet exists
    await walletService.getWalletById(transaction.wallet_id);

    // Delete the transaction from the database
    await transactionService.deleteById(+id);

    res.json({ message: 'Transaction deleted' });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.nativeError?.sqlMessage || error.message });
  }
};

export const deleteTransactionTag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the transaction exists
    const transactionService = new TransactionService();
    const transaction = await transactionService.getTransactionById(+id);

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

export const getYearlyStatistics = async (req: Request, res: Response) => {
  const { wallet_id, year, tags }: Record<string, any> = req.query;

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const monthlyData: any = Array(12)
    .fill(0)
    .map((_) => ({ income: 0, expense: 0 }));

  try {
    let query = Transaction.query().whereBetween('date_added', [
      startDate,
      endDate
    ]);

    if (wallet_id) {
      query = query.where('wallet_id', wallet_id);
    }

    if (tags) {
      const tagList = `${tags}`.split(',');
      query = query.whereIn('tag', tagList);
    }

    const transactions = await query;

    for (const transaction of transactions) {
      const monthNumber = transaction.date_added.getMonth();

      monthlyData[monthNumber][transaction.type] += transaction.amount;
    }

    res.json({ yearly_statistics: monthlyData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getMonthlyStatistics = async (req: Request, res: Response) => {
  const { wallet_id, start_date, tags }: Record<string, any> = req.query;

  if (!start_date) {
    res.status(400).json({ message: 'start_date is required' });
    return;
  }

  const startDate = new Date(start_date.toString());
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const weeklyData: any = Array(4)
    .fill(0)
    .map((_) => ({ income: 0, expense: 0 }));

  try {
    let query = Transaction.query().whereBetween('date_added', [
      startDate,
      endDate
    ]);

    if (wallet_id) {
      query = query.where('wallet_id', wallet_id);
    }

    if (tags) {
      const tagList = tags.toString().split(',');
      query = query.whereIn('tag', tagList);
    }

    const transactions = await query;

    for (const transaction of transactions) {
      const weekNumber = Math.floor(transaction.date_added.getDate() / 7);

      weeklyData[weekNumber > 3 ? 3 : weekNumber][transaction.type] +=
        transaction.amount;
    }

    res.json({ monthly_statistics: weeklyData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
