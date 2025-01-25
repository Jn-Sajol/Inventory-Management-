import express from "express";
import { createCustomer, getCustomerByOrder } from "../Controller/CustomerController";
import { createSupplier } from "../Controller/SupplierController";
const supplierRouter = express.Router();

supplierRouter.post('/createsupplier', createSupplier)
supplierRouter.get('/getcustomer', getCustomerByOrder)
// customerRouter.get('/getattendentbyslug/:slug', getAttendentFromShop)
// customerRouter.get('/getsingleshop/:id', getSingleShop)
// userRouter.put('/updateuserpassword/:id', updateUserPassword)
// userRouter.delete('/deleteuser/:id', deleteUser)

export default supplierRouter