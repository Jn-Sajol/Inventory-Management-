import { Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { StatusCodes } from "http-status-codes";

export const createCustomer = async (req: Request, res: Response) => {
//   const {  } = req.body;

  try {
    // if (
    //   !username &&
    //   !email &&
    //   !password &&
    //   !firstname &&
    //   !lastname &&
    //   !phone &&
    //   !dob &&
    //   !gender &&
    //   !role
    // ) {
    //   res.send("email and name is required");
    // }
    const checkDuplicate = await prisma.customer.findFirst({
      where: {
        OR: [{ phone: req.body.phone }, { email: req.body.email }, { id: req.body.id }]

      },
    });
    if (checkDuplicate) {
      throw new Error("already this customer exist");
    }
    //   const normalizedRole = role?.toUpperCase();
    //   console.log("Normalized role:", normalizedRole);

    const newCustomer = await prisma.customer.create({
      data: req.body
    });
    // const { password: String, ...others } = newUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Customer has created",
      user: newCustomer,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};

//Get all Customer
export const getCustomerByOrder = async (req: Request, res: Response) => {
    try {
      const getCustomer = await prisma.customer.findMany({
        orderBy: {
          createAt: "asc",
        },
      });
      if (!getCustomer || getCustomer.length < 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "No customer found with the given ID.",
        });
        return;
      }
    //   const usersWithoutPassword = getUser.map(
    //     ({ password, ...others }) => others
    //   );
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Customer are got",
        user: getCustomer,
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error && error.message ? error.message : "server error",
      });
    }
  };