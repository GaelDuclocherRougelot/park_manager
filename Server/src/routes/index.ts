import express from 'express';
import userRouter from './user';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, world!');
});

router.use('/user', userRouter);

export default router;
