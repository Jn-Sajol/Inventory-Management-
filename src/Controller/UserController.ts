import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";
import { hashSync } from "bcrypt";

export const userRegistration = async (req: Request, res: Response) => {
  const {
    username,
    email,
    password,
    firstname,
    lastname,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    if (
      !username &&
      !email &&
      !password &&
      !firstname &&
      !lastname &&
      !phone &&
      !dob &&
      !gender &&
      !role
    ) {
      res.send("email and name is required");
    }
    const checkDuplicate = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }, { phone: parseInt(phone, 10) }],
      },
    });
    if (checkDuplicate) {
      throw new Error("already user exist by this");
    }
    //   const normalizedRole = role?.toUpperCase();
    //   console.log("Normalized role:", normalizedRole);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        firstname,
        lastname,
        phone,
        dob,
        gender,
        image,
        role,
        password: hashSync(password, 10),
      },
    });
    const { password: String, ...others } = newUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User has created",
      user: others,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};

// get user by id and order

export const getUserByIdAndOrder = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const getUser = await prisma.user.findMany({
      // where: {
      //   id: parseInt(id),
      // },
      orderBy: {
        createAt: "desc",
      },
    });
    if (!getUser || getUser.length <0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found with the given ID.",
      });
      return
    }
    const usersWithoutPassword = getUser.map(({ password, ...others }) => others);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User has created",
      user: usersWithoutPassword,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};
