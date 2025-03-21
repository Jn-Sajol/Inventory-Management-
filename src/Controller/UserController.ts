import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../Db/db.config";
import { compare, hashSync } from "bcrypt";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";
// import { Role } from "@prisma/client";

//user Registration
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

//User Login
export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new Error("email and name is required");
    }
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Credential");
    }

    const token = jwt.sign({ id: user.id }, "secretkey", {
      expiresIn: "24h",
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User Login Successfully",
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
      token: token,
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

//Get Attendent by role
export const getAttendentByRole = async (req: Request, res: Response) => {
  try {
    const getUser = await prisma.user.findMany({
      where:{
        role:"ATTENDENT"
      }
    });
    if (!getUser || getUser.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No user found with the given role.",
      });
      return;
    }
    const usersWithoutPassword = getUser.map(
      ({ password, ...others }) => others
    );
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Attendent are bellow",
      count:userRegistration.length+1,
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

//Update users password
export const updateUserPassword = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { password } = req.body;

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
        password:hashSync(password,10)
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

//deleteUser
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;

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
    const updateUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    if(updateUser == null){
      res.send('user not deleted')
      return
    }
    // const { password: String, ...others } = updateUser;
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User has deleted",
      // user: others,
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error && error.message ? error.message : "server error",
    });
  }
};
