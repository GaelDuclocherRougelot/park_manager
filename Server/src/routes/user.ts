import userController from '@/controllers/user';
import { authenticateJWT } from '@/middlewares/JWT';
import { login, register, updateProfile } from '@/validations/schemas/user';
import validator from '@/validations/validator';
import express from 'express';

const router = express.Router();

router.get('/', userController.findAllUsers);

router.post('/register', validator(register), userController.register);

router.post('/login', validator(login), userController.login);

router.get('/profile', authenticateJWT, userController.findOneUserById);
router.patch('/profile/edit', authenticateJWT, validator(updateProfile), userController.updateProfile);

export default router;
