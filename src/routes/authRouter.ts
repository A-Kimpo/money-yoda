import { Router } from 'express';
import {
  login,
  refreshToken,
  isAuth,
  logout
} from '@/controllers/authController';

const router = Router();

router.post('', login);
router.post('/logout', logout);
router.get('/isAuth', isAuth);
router.post('/refreshToken', refreshToken);

export default router;
