import { Router } from 'express';
import {
  getWallets,
  getWalletsByUserId,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet
} from '@/controllers/walletController';

const router = Router();

router.get('', getWallets);
router.get('/user/:id', getWalletsByUserId);
router.get('/:id', getWallet);
router.post('/create', createWallet);
router.put('/update/:id', updateWallet);
router.delete('/delete/:id', deleteWallet);

export default router;