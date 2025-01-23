
import express from "express";
import {  getUserById, getUserByOrder, userRegistration } from "../Controller/UserController";
const userRouter = express.Router();

userRouter.post('/register', userRegistration)
userRouter.get('/getusers', getUserByOrder)
userRouter.get('/getuserbyid/:id', getUserById)

export default userRouter;