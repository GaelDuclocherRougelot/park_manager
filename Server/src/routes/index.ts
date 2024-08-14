import { authenticateJWT, isAdmin } from '@/middlewares/JWT';
import express from 'express';
import adminRouter from './admin';
import userRouter from './user';
import parkingController from '@/controllers/parking';

const router = express.Router();

router.get('/parkings', parkingController.getPaginatedParkingsByOnwer);

router.use('/', userRouter);
router.use('/admin', authenticateJWT, isAdmin, adminRouter);

export default router;
