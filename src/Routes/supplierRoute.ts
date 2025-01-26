import express from "express";
import { createSupplier, getSupplierByOrder } from "../Controller/SupplierController";
const supplierRouter = express.Router();

supplierRouter.post('/createsupplier', createSupplier)
supplierRouter.get('/getsupplier', getSupplierByOrder)
// customerRouter.get('/getsingleshop/:id', getSingleShop)
// userRouter.put('/updateuserpassword/:id', updateUserPassword)
// userRouter.delete('/deleteuser/:id', deleteUser)

export default supplierRouter