import express from "express";
import { createUnit, deleteUnit, getAllUnits, getUnitById, updateUnit } from "../Controller/UnitController";


const unitRouter = express.Router();

// Create Unit
unitRouter.post("/createunit", createUnit);

// Get All Units
unitRouter.get("/getunits", getAllUnits);

// Get Unit by ID
unitRouter.get("/getsingleunits/:id", getUnitById);

// Update Unit
unitRouter.put("/updateunits/:id", updateUnit);

// Delete Unit
unitRouter.delete("/deleteunits/:id", deleteUnit);

export default unitRouter;
