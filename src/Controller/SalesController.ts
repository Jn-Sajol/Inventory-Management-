import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

interface SaleRequest {
  customerId: number;
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  balanceAmount: number;
  paidAmount: number;
  saleType: string; // e.g., "online" or "in-store", depending on your logic
  paymentStatus: string; // e.g., "paid", "unpaid", "partial"
  paymentMethod: string; // e.g., "credit card", "cash", "bank transfer"
  transactionCode: string;
  shopId:number // Can be `null` or a string for the transaction code
  saleItem: SaleItems[]; // Assuming this refers to an array of SaleItems
}

// Assuming SaleItems is already defined like this:
interface SaleItems {
  saleId: number;
  productId: number;
  qty: number;
  productPrice: number;
  productName: string;
  productImage: string;
}

export const createSale = async (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentStatus,
    paymentMethod,
    transactionCode,
    saleItem,
    shopId
  }: SaleRequest = req.body as SaleRequest;
  try {
    const saleId = await prisma.$transaction(async (transaction) => {
      //if the balance amount >0 check the condition
      if(balanceAmount>0){
        const updateCustomer = await transaction.customer.update({
          where:{
            id:customerId
          },
          data:{
            unpaidCurrentAmount:{
              increment:balanceAmount
            }
          }
        })
      }
      // Create the Line Order
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          paymentMethod,
          // payment Method
          saleNumber: Math.ceil(Math.random() * 100),
          saleType,
          saleAmount,
          balanceAmount,
          paymentStatus,
          paidAmount,
          transactionCode,
          shopId
        },
      });

      if (saleItem && saleItem.length > 0) {
        for (const item of saleItem) {
          // Update Product stock quantity
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            res.send(
              `Failed to update stock for product ID: ${item.productId}`
            );
            return;
          }

          // Create sale Item
          const saleItem = await transaction.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.productPrice,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            res.send(
              `Failed to create line sale item for product ID: ${item.productId}`
            );
            return;
          }
        }
      }
      return sale.id;
    });

    const sale = await prisma.sale.findUnique({
      where: {
        id: saleId,
      },
      include: {
        saleItem: true,
      },
    });
    // console.log(savedLineOrder);
    res.json(sale).status(200);
  } catch (error) {
    res.send(error);
  }
};

export const getAllSales = async (req: Request, res: Response) => {
  try {
    const sale = await prisma.sale.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        saleItem: true,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      sale,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

//create saleItem
export const createSaleItem = async (req: Request, res: Response) => {
  const { saleId, productId, qty, productPrice, productName, productImage } =
    req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: {
          decrement: qty,
        },
      },
    });

    // Create sale Item
    const saleItem = await prisma.saleItem.create({
      data: {
        saleId,
        productId,
        qty,
        productPrice,
        productName,
        productImage,
      },
    });

    res.json(saleItem).status(200);
  } catch (error) {
    res.send(error);
  }
};
