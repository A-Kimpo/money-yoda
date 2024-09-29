import { Router } from 'express';

import { auth } from '@/middlewares';
import authRouter from './authRouter';
import userRouter from './userRouter';
import walletRouter from './walletRouter';
import transactionRouter from './transactionRouter';

const router = Router();

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/wallets', auth, walletRouter)
  .use('/transactions', auth, transactionRouter);

export default router;
