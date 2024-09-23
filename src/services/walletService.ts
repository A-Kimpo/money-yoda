import { Response } from 'express';
import { UAParser } from 'ua-parser-js';
import jwt from 'jsonwebtoken';

import { User } from '@/models';
import { Token } from '@/models';
import config from '@/config';

export default class WalletService {  
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