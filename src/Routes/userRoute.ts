
import express from "express";
import {  getUserById, getUserByOrder, updateUser, userRegistration } from "../Controller/UserController";
const userRouter = express.Router();

userRouter.post('/register', userRegistration)
userRouter.get('/getusers', getUserByOrder)
userRouter.get('/getuserbyid/:id', getUserById)
userRouter.put('/updateuser/:id', updateUser)

export default userRouter;