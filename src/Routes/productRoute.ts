import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../Controller/ProductController";

const productRouter = express.Router();

// Create Product
productRouter.post("/createproduct", createProduct);

// Get All Products
productRouter.get("/getproducts", getAllProducts);

// Get Product by ID
productRouter.get("/getsingleproduct/:id", getProductById);

// Update Product
productRouter.put("/updateproduct/:id", updateProduct);

// Delete Product
productRouter.delete("/deleteproduct/:id", deleteProduct);

export default productRouter;
