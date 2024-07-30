import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove
} from '@/controllers/userController';
import { auth, authAdmin } from '@/middlewares';

const router = Router();

router.get('', authAdmin, getAll);
router.post('/create', create);
router.get('/:user_id', auth, getById);
router.put('/:user_id', authAdmin, update);
router.delete('/:user_id', authAdmin, remove);

export default router;
