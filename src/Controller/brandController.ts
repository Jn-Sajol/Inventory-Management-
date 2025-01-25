import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

// Create Brand
export const createBrand = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  try {
    if (!name || !slug) {
      throw new Error("All fields (name, slug) are required.");
    }

    const checkDuplicate = await prisma.brand.findFirst({
      where: {
        slug,
      },
    });

    if (checkDuplicate) {
      res.send("Brand with the same name or slug already exists.");
      return;
    }

    const newBrand = await prisma.brand.create({
      data: {
        name,
        slug,
      },
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Brand created successfully.",
      brand: newBrand,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get All Brands
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { createAt: "asc" },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      brands,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get Brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!brand) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      brand,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Update Brand
export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!brand) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    const updatedBrand = await prisma.brand.update({
      where: { id: Number(id) },
      data: {
        name,
        slug,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Brand updated successfully.",
      brand: updatedBrand,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Delete Brand
export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!brand) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Brand not found.",
      });
      return;
    }

    await prisma.brand.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Brand deleted successfully.",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
