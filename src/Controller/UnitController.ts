import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

// Create Unit
export const createUnit = async (req: Request, res: Response) => {
  const { name, abbreviation, slug,} = req.body;

  try {
    if (!name || !abbreviation || !slug ) {
      throw new Error("All fields (name, abbreviation, slug, are required.");
    }

    const checkDuplicate = await prisma.unit.findFirst({
      where: {
         slug 
      },
    });

    if (checkDuplicate) {
      res.send("Unit with the same name or slug already exists.");
      return
    }

    const newUnit = await prisma.unit.create({
      data: {
        name,
        abbreviation,
        slug
      },
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Unit created successfully.",
      unit: newUnit,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get All Units
export const getAllUnits = async (req: Request, res: Response) => {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { createAt: "asc" },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      units,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get Unit by ID
export const getUnitById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const unit = await prisma.unit.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!unit) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unit not found.",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      unit,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Update Unit
export const updateUnit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, abbreviation, slug,} = req.body;

  try {
    const unit = await prisma.unit.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!unit) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unit not found.",
      });
      return;
    }

    const updatedUnit = await prisma.unit.update({
      where: { id: Number(id) },
      data: {
        name,
        abbreviation,
        slug,
    
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Unit updated successfully.",
      unit: updatedUnit,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Delete Unit
export const deleteUnit = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const unit = await prisma.unit.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!unit) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Unit not found.",
      });
      return;
    }

    await prisma.unit.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Unit deleted successfully.",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
