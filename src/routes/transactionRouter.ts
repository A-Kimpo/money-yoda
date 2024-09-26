import { Router } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByTag,
  deleteTransactionTag,
  getTransactionsByWallet,
  getTransactionsByType,
  getYearlyStatistics,
  getMonthlyStatistics
} from '@/controllers/transactionController';

const router = Router();

router.post('/create', createTransaction);
router.put('/update/:id', updateTransaction);
router.delete('/delete/:id', deleteTransaction);

router.get('', getAllTransactions);
router.get('/:id', getTransactionById);
router.get('/wallet/:wallet_id', getTransactionsByWallet);
router.get('/type/:type', getTransactionsByType);
router.get('/tag/:tag', getTransactionsByTag);
router.delete('/delete/tag/:id', deleteTransactionTag);

router.get('/statistics/monthly', getMonthlyStatistics);
router.get('/statistics/yearly', getYearlyStatistics);

export default router;
