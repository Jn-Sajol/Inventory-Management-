import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

// Create Product
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, productBatchNumber, image, sku, productCode, alertQuantity, stockQuantity, productBarcode, price, slug, expiredate, supplierId, unitId, brandId, categoryId } = req.body;

  try {
    if (!name || !sku || !productCode || !slug || !expiredate || !supplierId || !unitId || !brandId || !categoryId || !price) {
      throw new Error("Required fields are missing.");
    }

    const checkDuplicateSku = await prisma.product.findFirst({ where: { sku } });
    const checkDuplicateProductCode = await prisma.product.findFirst({ where: { productCode } });

    if (checkDuplicateSku || checkDuplicateProductCode) {
      res.status(StatusCodes.BAD_REQUEST).send("Product with the same SKU or Product Code already exists.");
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        productBatchNumber,
        image,
        sku,
        productCode,
        alertQuantity,
        stockQuantity,
        productBarcode,
        price,
        slug,
        expiredate,
        supplierId,
        unitId,
        brandId,
        categoryId
      },
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Product created successfully.",
      product: newProduct,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get All Products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        unit: true,
        brand: true,
        category: true,
        supplier: true,
      }
    });

    res.status(StatusCodes.OK).json({
      success: true,
      products,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    //   include: {
    //     unit: true,
    //     brand: true,
    //     category: true,
    //     supplier: true,
    //   },
    });

    if (!product) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      product,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Update Product
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, productBatchNumber, image, sku, productCode, alertQuantity, stockQuantity, productBarcode, price, slug, expiredate, supplierId, unitId, brandId, categoryId } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        productBatchNumber,
        image,
        sku,
        productCode,
        alertQuantity,
        stockQuantity,
        productBarcode,
        price,
        slug,
        expiredate,
        supplierId,
        unitId,
        brandId,
        categoryId,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found.",
      });
      return;
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};
