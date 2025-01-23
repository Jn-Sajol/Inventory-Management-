import { Request, Response } from "express";
import { prisma } from "../Db/db.config";
import { StatusCodes } from "http-status-codes";

export const createShop = async (req: Request, res: Response) => {
  const { name, slug, location, adminId, attendentId } = req.body;

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
    const checkDuplicate = await prisma.shop.findFirst({
      where: {
        slug,
      },
    });
    if (checkDuplicate) {
      throw new Error("already Fjop exist by this slug");
    }
    //   const normalizedRole = role?.toUpperCase();
    //   console.log("Normalized role:", normalizedRole);

    const newUser = await prisma.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendentId,
      },
    });
    // const { password: String, ...others } = newUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User has created",
      user: newUser,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};
