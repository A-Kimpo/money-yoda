import { Request, Response } from 'express';
import { Wallet, Transaction } from '../models';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await Transaction.query();

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
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

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { wallet_id, amount, type } = req.body;

    const wallet = await Wallet.query().findById(wallet_id);

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
      return;
    }

    // Calculate the new wallet balance
    const resultByType: Record<string, number> = {
      income: wallet.balance + +amount,
      expense: wallet.balance - +amount,
    };
    const newBalance = resultByType[type];

    // Update the wallet balance
    await Wallet.query().updateAndFetchById(wallet_id, { balance: newBalance });

    // Add the new transaction to the database
    const transaction = await Transaction.query().insert(req.body);
    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    // const id = req.params.id;
    // const transaction = await Transaction.query().update(id);
    // if (!transaction) {
    //   res.status(404).json({ message: 'Transaction not found' });
    // } else {
    //   res.json(transaction);
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Transaction.query().deleteById(id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
};

export const getTransactionsByTag = async (req: Request, res: Response) => {
  try {
    const tag = req.params.tag;
    const transactions = await Transaction.query().where('tag', tag);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching transactions by tag' });
  }
};
