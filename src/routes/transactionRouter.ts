import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  deleteTransactionTag,
  getYearlyStatistics,
  getMonthlyStatistics
} from '@/controllers/transactionController';

const router = Router();

router.get('', getTransactions);
router.get('/:id', getTransactionById);
router.post('/create', createTransaction);
router.put('/update/:id', updateTransaction);
router.delete('/delete/:id', deleteTransaction);
router.delete('/delete/tag/:id', deleteTransactionTag);

router.get('/statistics/monthly', getMonthlyStatistics);
router.get('/statistics/yearly', getYearlyStatistics);

export default router;
