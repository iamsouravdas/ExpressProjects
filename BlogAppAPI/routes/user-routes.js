import express from 'express';
import { getAllUser, signup, login } from '../controllers/user-controller.js';


const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.post("/signup", signup);
userRouter.post("/login", login);
export {
    userRouter
}