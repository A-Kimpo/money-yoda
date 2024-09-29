import { Request, Response } from 'express';

import { User, Wallet } from '@/models';
import { WalletService } from '@/services';
import { paginate } from '@/utils';

export const getWallets = async (req: Request, res: Response) => {
  try {
    const queryBuilder = Wallet.query();

    paginate(req.query, queryBuilder)

    const wallets = await queryBuilder;

    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};

export const getUserWallets = async (req: Request, res: Response) => {
  try {
    const { id: user_id } = req.params;

    const queryBuilder = Wallet.query().where('user_id', user_id);

    paginate(req.query, queryBuilder);

    const wallets = await queryBuilder;

    res.json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching wallets' });
  }
};

export const getWalletById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const walletService = new WalletService();

    const wallet = await walletService.getWalletById(+id);

    res.json(wallet);
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
      balance: 0
    });

    res.json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating wallet' });
  }
};

export const updateWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const walletService = new WalletService();

    // Check if the wallet exists
    const wallet = await walletService.getWalletById(+id);

    // Update the wallet in the database
    const updatedWallet = await Wallet.query().updateAndFetchById(
      id,
      { ...wallet, name }
    );

    if (updatedWallet) {
      res.json(updatedWallet);
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

export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const walletService = new WalletService();

    // Check if the wallet exists
    await walletService.getWalletById(+id);

    // Delete the wallet from the database
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
};
