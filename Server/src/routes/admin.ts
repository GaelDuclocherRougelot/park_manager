import express from 'express';
import parkingController from '@/controllers/parking';
const router = express.Router();

router.post('/parking/create', parkingController.createParking);
router.post('/spaces/create/:parkingId', parkingController.createSpaces);

export default router;
