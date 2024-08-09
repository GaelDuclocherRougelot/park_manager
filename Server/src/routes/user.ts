import parkingController from '@/controllers/parking';
import userController from '@/controllers/user';
import { authenticateJWT } from '@/middlewares/JWT';
import { login, register, updateProfile } from '@/validations/schemas/user';
import validator from '@/validations/validator';
import express from 'express';

const router = express.Router();

router.get('/', userController.findAllUsers);

// Registration
router.post('/register', validator(register), userController.register);
router.post('/login', validator(login), userController.login);

// Profile
router.get('/profile', authenticateJWT, userController.findOneUserById);
router.patch('/profile/edit', authenticateJWT, validator(updateProfile), userController.updateProfile);
router.delete('/profile/delete', authenticateJWT, userController.deleteProfile);

// Spaces
router.patch('/space/assign/:spaceId', authenticateJWT, parkingController.assignUserToOneSpace);
router.patch('/space/unassign/:spaceId', authenticateJWT, parkingController.unassignUserToOneSpace);


export default router;
