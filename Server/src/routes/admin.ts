import express from 'express';
import parkingController from '@/controllers/parking';
const router = express.Router();

router.get('/parkings', parkingController.findParkingsByOwner);
router.post('/parking/create', parkingController.createParking);
router.patch('/parkings/edit/:parkingId', parkingController.updateParking);
router.post('/spaces/create/:parkingId', parkingController.createSpaces);

export default router;
