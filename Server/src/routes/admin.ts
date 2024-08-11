import express from 'express';
import parkingController from '@/controllers/parking';
import validator from '@/validations/validator';
import { parking, parkingEdit } from '@/validations/schemas/parking';
const router = express.Router();

router.get('/parkings', parkingController.findParkingsByOwner);
router.post('/parking/create', validator(parking) ,parkingController.createParking);
router.patch('/parkings/edit/:parkingId', validator(parkingEdit), parkingController.updateParking);
router.delete('/parkings/delete/:parkingId', parkingController.deleteParkingByPk);

router.post('/spaces/create/:parkingId', parkingController.createSpaces);

export default router;
