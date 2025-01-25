import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

// Create Category
export const createCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;

  try {
    if (!name || !slug) {
      throw new Error("All fields (name, slug) are required.");
    }

    const checkDuplicate = await prisma.category.findFirst({
      where: { slug },
    });

    if (checkDuplicate) {
      res.status(StatusCodes.BAD_REQUEST).send("Category with the same slug already exists.");
      return;
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get All Categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createAt: "asc" },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      categories,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get Category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      category,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, slug },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found.",
      });
      return;
    }

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
