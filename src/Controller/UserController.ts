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

export const getUserByOrder = async (req: Request, res: Response) => {
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
    if (!getUser || getUser.length < 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found with the given ID.",
      });
      return;
    }
    const usersWithoutPassword = getUser.map(
      ({ password, ...others }) => others
    );
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

//get single user by id
export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);
  try {
    const getUser = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
      // orderBy: {
      //   createAt: "desc",
      // },
    });
    if (!getUser) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found with the given ID.",
      });
      return;
    }
    const { password, ...others } = getUser;
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

//User Update

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { username, firstname, lastname, phone, dob, gender, image, role } =
    req.body;

  try {
    const finduser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!finduser) {
      res.send("no user found");
      return;
    }
    const updateUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        firstname,
        lastname,
        phone,
        dob,
        gender,
        image,
        role,
      },
    });

    const { password: String, ...others } = updateUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User has Updated",
      user: others,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};
