import userController from '@/controllers/user';
import { authenticateJWT } from '@/middlewares/JWT';
import { login, register } from '@/validations/schemas/user';
import validator from '@/validations/validator';
import express from 'express';

const router = express.Router();

router.get('/', authenticateJWT, userController.findAllUsers);

router.post('/register', validator(register), userController.register);

router.post('/login', validator(login), userController.login);

router.get('/profile', authenticateJWT, userController.findOneUserById);

export default router;
