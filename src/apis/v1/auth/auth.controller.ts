import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "~/types/Request";
import { AuthFailureError, BadRequestError } from "~/responses/error";
import { compareFunction, compareString, hashFunction } from "~/utils/bcryptHandle";
import { omitData } from "~/utils/pick";
import User from "~/models/User";
import jwtHandler from "~/utils/jwtHandle";
import HttpStatusCode from "~/enums/HttpStatusCode";
import ReasonPhrase from "~/enums/ReasonPhrase";
import generateNumber from "~/utils/generateNumber";
import roles from "~/constants/roles";

class AuthController {
  static loginHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode, password } = req.body;

    const user = await User.findOne({ studentCode });

    if (!user) throw new AuthFailureError("Invalid student code or password!");

    if (user.role === "admin") {
      if (!(await compareFunction(password, user.password)))
        throw new AuthFailureError("Invalid student code or password!");
    } else {
      if (!compareString(password, user.password)) throw new AuthFailureError("Invalid student code or password!");
    }

    if (user.isOnline) throw new AuthFailureError("User is already logged in!");

    const { refreshToken, accessToken } = await jwtHandler.createTokenPair({
      user: omitData({ fields: ["password", "createdAt", "updatedAt", "__v"], object: user.toObject() }),
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      payload: {
        user: omitData({ fields: ["password", "createdAt", "updatedAt", "__v"], object: user.toObject() }),
        refreshToken,
        accessToken,
      },
      error: null,
      message: "User logged in successfully!",
    });
  };

  //signUpHandle
  static signUpHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode, studentName, studentClass, studentHometown, studentPhone, role } = req.body;
    const duplicate = await User.findOne({ studentCode });

    if (duplicate)
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        payload: {
          studentCode,
          studentName,
          studentClass,
          studentHometown,
          studentPhone,
          role,
        },
        error: { reason: ReasonPhrase.CONFLICT },
        message: "Student already exist!",
      });

    const isRoleActive = roles.some((r) => role === r);

    if (!isRoleActive) {
      throw new BadRequestError("Role is not active!");
    }

    let password = "";

    if (role === "admin") {
      password = await hashFunction("admin");
    } else {
      password = generateNumber().toString();
    }

    let user = new User({
      studentCode,
      studentName,
      studentClass,
      studentHometown,
      studentPhone,
      password,
      role,
    });

    user = await user.save();

    let newUser = await User.findOne({ studentCode });

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      payload: { ...newUser?.toObject(), password },
      error: null,
      message: "User registered successfully!",
    });
  };

  // resetPasswordHandle
  static resetPasswordHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode, password } = req.body;
    try {
      const user = await User.findOne({ studentCode });

      if (!user) throw new AuthFailureError("Invalid student code or password!");

      const hashedPassword = await hashFunction(password);

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        throw new BadRequestError("Failed to update password!");
      }

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: {
          user: omitData({ fields: ["password"], object: updatedUser }),
        },
        error: null,
        message: "Password updated successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
