import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";

// Create Brand
export const createSale = async (req: Request, res: Response) => {
  const {
    customerId,
    customerName,
    saleNumber,
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    orderType,
    paymentStatus,
    paymentMethod,
    transactionCode,
    saleItem
  } = req.body;

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

export const createSale = async (req: Request, res: Response) =>{
  const { orderItems, orderAmount, orderType, source } = newOrder;
  try {
    const lineOrderId = await prisma.$transaction(async (transaction) => {
      // Create the Line Order
      const lineOrder = await transaction.lineOrder.create({
        data: {
          customerId: customerData.customerId,
          customerName: customerData.customerName,
          customerEmail: customerData.customerEmail,
          // Personal Details
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          email: customerData.email,
          // Shipping address
          streetAddress: customerData.streetAddress,
          apartment: customerData.apartment,
          city: customerData.city,
          state: customerData.state,
          zipCode: customerData.zipCode,
          country: customerData.country,
          paymentMethod: customerData.method,
          // payment Method
          orderNumber: generateOrderNumber(),
          orderAmount,
          orderType,
          source,
          status: source === "pos" ? "DELIVERED" : "PROCESSING",
        },
      });
 
      for (const item of orderItems) {
        // Update Product stock quantity
        const updatedProduct = await transaction.product.update({
          where: { id: item.id },
          data: {
            stockQty: {
              decrement: item.qty,
            },
          },
        });
 
        if (!updatedProduct) {
          throw new Error(`Failed to update stock for product ID: ${item.id}`);
        }
 
        if (updatedProduct.stockQty < updatedProduct.alertQty) {
          // Send/Create the Notification
          const message =
            updatedProduct.stockQty === 0
              ? `The stock of ${updatedProduct.name} is out. Current stock: ${updatedProduct.stockQty}.`
              : `The stock of ${updatedProduct.name} has gone below threshold. Current stock: ${updatedProduct.stockQty}.`;
          const statusText =
            updatedProduct.stockQty === 0 ? "Stock Out" : "Warning";
          const status: NotificationStatus =
            updatedProduct.stockQty === 0 ? "DANGER" : "WARNING";
 
          const newNotification = {
            message,
            status,
            statusText,
          };
          await createNotification(newNotification);
          // Send email
        }
        // Create Line Order Item
        const lineOrderItem = await transaction.lineOrderItem.create({
          data: {
            orderId: lineOrder.id,
            productId: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            productThumbnail: item.productThumbnail,
          },
        });
 
        if (!lineOrderItem) {
          throw new Error(
            `Failed to create line order item for product ID: ${item.id}`
          );
        }
 
        // Create Sale
        const sale = await transaction.sale.create({
          data: {
            orderId: lineOrder.id,
            productId: item.id,
            qty: item.qty,
            salePrice: item.price,
            productName: item.name,
            productImage: item.productThumbnail,
            customerName: customerData.customerName,
            customerEmail: customerData.customerEmail,
          },
        });
 
        if (!sale) {
          throw new Error(`Failed to create sale for product ID: ${item.id}`);
        }
      }
      // console.log(savedLineOrder);
      revalidatePath("/dashboard/sales");
      return lineOrder.id;
    });
 
    const savedLineOrder = await prisma.lineOrder.findUnique({
      where: {
        id: lineOrderId,
      },
      include: {
        lineOrderItems: true,
      },
    });
    // console.log(savedLineOrder);
    return savedLineOrder as ILineOrder;
  } catch (error) {
    console.error("Transaction error:", error);
    throw error; // Propagate the error to the caller
  }
}