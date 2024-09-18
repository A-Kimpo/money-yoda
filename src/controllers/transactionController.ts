import { Request, Response } from 'express';
import { Transaction } from '../models';

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
