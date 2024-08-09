import express from 'express';
import parkingController from '@/controllers/parking';
const router = express.Router();

router.post('/parking/create', parkingController.createParking);


export default router;
