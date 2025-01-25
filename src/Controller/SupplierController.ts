import { Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { StatusCodes } from "http-status-codes";

export const createSupplier = async (req: Request, res: Response) => {
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
    const checkDuplicate = await prisma.supplier.findFirst({
      where: {
        OR: [{ phone: req.body.phone }, { email: req.body.email }, { id: req.body.id }]

      },
    });
    if (checkDuplicate) {
      throw new Error("already this Supplier exist");
    }
    //   const normalizedRole = role?.toUpperCase();
    //   console.log("Normalized role:", normalizedRole);

    const newSupplier = await prisma.supplier.create({
      data: req.body
    });
    // const { password: String, ...others } = newUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "newSupplier has created",
      user: newSupplier,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};