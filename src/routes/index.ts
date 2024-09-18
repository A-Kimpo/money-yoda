import { Router } from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';
import walletRouter from './walletRouter';
import transactionRouter from './transactionRouter';

const router = Router();

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/wallets', walletRouter)
  .use('/transactions', transactionRouter);

export default router;
