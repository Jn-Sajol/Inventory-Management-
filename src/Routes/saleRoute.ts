import express from "express";
import { createSale, createSaleItem, getAllSales } from "../Controller/SalesController";

const saleroute = express.Router();

// Create Brand
saleroute.post("/createsale", createSale);
saleroute.post("/createsale/item", createSaleItem);

// Get All Brands
saleroute.get("/getsale", getAllSales);

// // Get Brand by ID
// saleroute.get("/getsinglebrand/:id", getBrandById);

// // Update Brand
// saleroute.put("/updatebrand/:id", updateBrand);

// // Delete Brand
// saleroute.delete("/deletebrand/:id", deleteBrand);

export default saleroute;
