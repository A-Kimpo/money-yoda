import { Router } from 'express';
import {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByTag
} from '@/controllers/transactionController';

const router = Router();

router.get('', getAllTransactions);
router.get('/:id', getTransaction);
router.get('/:tag', getTransactionsByTag);
router.post('/create', createTransaction);
router.put('/update/:id', updateTransaction);
router.delete('/delete/:id', deleteTransaction);

export default router;
