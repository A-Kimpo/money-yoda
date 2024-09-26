import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByTag,
  getTransactionsByWallet,
  getTransactionsByType,
  getStatistics
} from '@/controllers/transactionController';

const router = Router();

router.get('', getAllTransactions);
router.get('/:id', getTransactionById);
router.get('/tag/:tag', getTransactionsByTag);
router.get('/wallet/:wallet_id', getTransactionsByWallet);
router.get('/type/:type', getTransactionsByType);
router.post('/create', createTransaction);
router.put('/update/:id', updateTransaction);
router.delete('/delete/:id', deleteTransaction);

router.get('/statistics/all', getStatistics)

export default router;
