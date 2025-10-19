import express from 'express';
import {registerUser, loginUser, logoutUser} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);

export default userRouter;