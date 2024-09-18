import { Request, Response } from 'express';
import { Wallet } from '../models';

export const getWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.query();

    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};

export const getWallet = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const wallet = await Wallet.query().findById(id);

    if (!wallet) {
      res.status(404).json({ message: 'Wallet not found' });
    } else {
      res.json(wallet);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallet' });
  }
};

export const createWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.query().insert(req.body);

    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating wallet' });
  }
};

export const updateWallet = async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    // const wallet = await Wallet.query().update(id);

    // res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating wallet' });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Wallet.query().deleteById(id);

    res.json({ message: 'Wallet deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting wallet' });
  }
};
