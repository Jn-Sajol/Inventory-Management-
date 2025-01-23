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
      throw new Error("already shop exist by this slug");
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
      message: "Shop has created",
      user: newUser,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};

//Get shop
export const getShopByOrder = async (req: Request, res: Response) => {
    try {
      const getShop = await prisma.shop.findMany({
        // where: {
        //   id: parseInt(id),
        // },
        orderBy: {
          createAt: "asc",
        },
      });
      if (!getShop || getShop.length < 0) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "No shop found with the given ID.",
        });
        return;
      }
    //   const usersWithoutPassword = getUser.map(
    //     ({ password, ...others }) => others
    //   );
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "SHop are got",
        user: getShop,
      });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error && error.message ? error.message : "server error",
      });
    }
  };

//get attendent from the shop
export const getAttendentFromShop= async (req: Request, res: Response) => {
  const slug = req.params.slug;
  try {
    const getShop = await prisma.shop.findUnique({
      where: {
        slug
      },
    
    });
    if (!getShop) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No shop found with the given slug.",
      });
      return;
    }
  const attendent = await prisma.user.findMany({
    where:{
      id:{
        in:getShop.attendentId
      }
    },
    select:{
      id:true,
      role:true,
      username:true,
      gender:true
    }
  })
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "attendent are gotten",
      user: attendent,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};
