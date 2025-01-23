import express from "express";
import { createShop, getAttendentFromShop, getShopByOrder, getSingleShop } from "../Controller/ShopController";
const shopRouter = express.Router();

shopRouter.post('/createshop', createShop)
shopRouter.get('/getshops', getShopByOrder)
shopRouter.get('/getattendentbyslug/:slug', getAttendentFromShop)
shopRouter.get('/getsingleshop/:id', getSingleShop)
// userRouter.put('/updateuserpassword/:id', updateUserPassword)
// userRouter.delete('/deleteuser/:id', deleteUser)

export default shopRouter;