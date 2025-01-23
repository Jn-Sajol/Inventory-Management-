import express from "express";
import { createShop, getShopByOrder } from "../Controller/ShopController";
const shopRouter = express.Router();

shopRouter.post('/createshop', createShop)
shopRouter.get('/getshops', getShopByOrder)
// userRouter.get('/getuserbyid/:id', getUserById)
// userRouter.put('/updateuser/:id', updateUser)
// userRouter.put('/updateuserpassword/:id', updateUserPassword)
// userRouter.delete('/deleteuser/:id', deleteUser)

export default shopRouter;