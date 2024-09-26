import { Response } from 'express';
import { UAParser } from 'ua-parser-js';
import jwt from 'jsonwebtoken';

import { Wallet } from '@/models';
import { TransactionService } from '@/services';
import config from '@/config';

export default class WalletService {  
  async getBalance(walletId: number) {
    const wallet = await Wallet.query().findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    
    return wallet.balance;
  }

  // async createWallet(req: any, res: Response) {
  //   try {
  //     const { name: walletName, user_id } = req.body;

  //     const user = await User.query().findOne({ id: user_id });

  //     if (!user) throw new Error('User not found');

  //     const wallet = await User.query().insert({
  //       name: walletName,
  //       user_id: user.id,
  //       balance: 0,
  //     });

  //     res.json(wallet);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Error creating wallet' });
  //   }
  // }
}