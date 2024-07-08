import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "~/types/Request";
import { AuthFailureError, BadRequestError } from "~/responses/error";
import { compareFunction, hashFunction } from "~/utils/bcryptHandle";
import { omitData } from "~/utils/pick";
import User from "~/models/User";
import jwtHandler from "~/utils/jwtHandle";
import HttpStatusCode from "~/enums/HttpStatusCode";
import ReasonPhrase from "~/enums/ReasonPhrase";
import generateNumber from "~/utils/generateNumber";

class AuthController {
  static loginHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode, password } = req.body;

    const user = await User.findOne({ studentCode });

    if (!user) throw new AuthFailureError("Invalid student code or password!");

    if (!(await compareFunction(password, user.password)))
      throw new AuthFailureError("Invalid student code or password!");

    if (user.isOnline) throw new AuthFailureError("User is already logged in!");

    const { refreshToken, accessToken } = await jwtHandler.createTokenPair({
      user: omitData({ fields: ["password"], object: user }),
    });

    return res.status(HttpStatusCode.OK).json({
      success: true,
      payload: {
        user: omitData({ fields: ["password"], object: user }),
        refreshToken,
        accessToken,
      },
      error: null,
      message: "User logged in successfully!",
    });
  };

  //signUpHandle
  static signUpHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { studentCode, studentName, studentClass, studentPhone, role } = req.body;
    const duplicate = await User.findOne({ studentCode });

    if (duplicate)
      return res.status(HttpStatusCode.CONFLICT).json({
        success: false,
        payload: {
          studentCode,
          studentName,
          studentClass,
          studentPhone,
          role,
        },
        error: { reason: ReasonPhrase.CONFLICT },
        message: "Student already exist!",
      });

    const password = generateNumber().toString();

    const hashedPassword = await hashFunction(password);

    let user = new User({
      studentCode,
      studentName,
      studentClass,
      studentPhone,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    user = await user.save();

    return res.status(HttpStatusCode.CREATED).json({
      success: true,
      payload: { ...user, password },
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
