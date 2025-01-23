
import express from "express";
import { getUserByIdAndOrder, userRegistration } from "../Controller/UserController";
const userRouter = express.Router();

userRouter.post('/register', userRegistration)
userRouter.get('/getuser', getUserByIdAndOrder)

export default userRouter;