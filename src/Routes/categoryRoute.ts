import express from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../Controller/CategoryController";

const categoryRouter = express.Router();

// Create Category
categoryRouter.post("/createcategory", createCategory);

// Get All Categories
categoryRouter.get("/getcategories", getAllCategories);

// Get Category by ID
categoryRouter.get("/getsinglecategory/:id", getCategoryById);

// Update Category
categoryRouter.put("/updatecategory/:id", updateCategory);

// Delete Category
categoryRouter.delete("/deletecategory/:id", deleteCategory);

export default categoryRouter;
