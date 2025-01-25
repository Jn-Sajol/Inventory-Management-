import express from "express";
import { createCustomer, getCustomerByOrder } from "../Controller/CustomerController";
const customerRouter = express.Router();

customerRouter.post('/createcustomer', createCustomer)
customerRouter.get('/getcustomer', getCustomerByOrder)
// customerRouter.get('/getattendentbyslug/:slug', getAttendentFromShop)
// customerRouter.get('/getsingleshop/:id', getSingleShop)
// userRouter.put('/updateuserpassword/:id', updateUserPassword)
// userRouter.delete('/deleteuser/:id', deleteUser)

export default customerRouter;