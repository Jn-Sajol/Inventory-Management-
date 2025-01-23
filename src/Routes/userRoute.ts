
import express from "express";
import {  deleteUser, getUserById, getUserByOrder, updateUser, updateUserPassword, userRegistration } from "../Controller/UserController";
const userRouter = express.Router();

userRouter.post('/register', userRegistration)
userRouter.get('/getusers', getUserByOrder)
userRouter.get('/getuserbyid/:id', getUserById)
userRouter.put('/updateuser/:id', updateUser)
userRouter.put('/updateuserpassword/:id', updateUserPassword)
userRouter.delete('/deleteuser/:id', deleteUser)

export default userRouter;