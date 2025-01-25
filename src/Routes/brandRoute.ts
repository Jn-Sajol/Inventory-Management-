import express from "express";
import { createBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "../Controller/brandController";

const brandRouter = express.Router();

// Create Brand
brandRouter.post("/createbrand", createBrand);

// Get All Brands
brandRouter.get("/getbrands", getAllBrands);

// Get Brand by ID
brandRouter.get("/getsinglebrand/:id", getBrandById);

// Update Brand
brandRouter.put("/updatebrand/:id", updateBrand);

// Delete Brand
brandRouter.delete("/deletebrand/:id", deleteBrand);

export default brandRouter;
