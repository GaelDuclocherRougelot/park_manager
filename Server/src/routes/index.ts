import { authenticateJWT, isAdmin } from '@/middlewares/JWT';
import express from 'express';
import adminRouter from './admin';
import userRouter from './user';

const router = express.Router();

router.use('/', userRouter);
router.use('/admin', authenticateJWT, isAdmin, adminRouter);

export default router;
