import userController from '@/controllers/user';
import express from 'express';

const router = express.Router();

router.get('/', userController.findAllUsers);

router.post('/register', userController.register);

export default router;