import { Request, Response } from 'express';
import { User, Wallet } from '../models';

import { WalletService } from '@/services';

export const getWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.query();

    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};

export const getWalletsByUserId = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;
    const wallets = await Wallet.query().select('*').where('user_id', user_id);

    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};

export const getWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    const { name: walletName, user_id } = req.body;

    const user = await User.query().findOne({ id: user_id });

    if (!user) throw new Error('User not found');

    const wallet = await Wallet.query().insert({
      name: walletName,
      user_id: user.id,
      balance: 0,
    });

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

export const getBalance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const walletService = new WalletService();

    const balance = await walletService.getBalance(+id);
    res.json({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallet balance' });
  }
}
