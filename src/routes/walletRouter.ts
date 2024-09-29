import { Router } from 'express';
import {
  getWallets,
  getUserWallets,
  getWalletById,
  getBalance,
  createWallet,
  updateWallet,
  deleteWallet
} from '@/controllers/walletController';

const router = Router();

router.get('', getWallets);
router.get('/:id', getWalletById);
router.get('/user/:id', getUserWallets);
router.get('/balance/:id', getBalance);
router.post('/create', createWallet);
router.put('/update/:id', updateWallet);
router.delete('/delete/:id', deleteWallet);

export default router;
