import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  create,
  update,
  remove
} from '@/controllers/userController';
import { auth, authAdmin } from '@/middlewares';

const router = Router();

router.get('', authAdmin, getAllUsers);
router.get('/:user_id', auth, getUserById);
router.post('/create', create);
router.put('/:user_id', authAdmin, update);
router.delete('/:user_id', authAdmin, remove);

export default router;
