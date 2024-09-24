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
router.put('/:user_id', authAdmin, update);
router.delete('/:user_id', authAdmin, remove);
router.post('/create', create);

export default router;
