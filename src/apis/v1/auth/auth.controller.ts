import { Response, NextFunction } from "express";
import { omitData } from "../../../utils/pick";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import { AuthFailureError, BadRequestError } from "../../../responses/error";
import roles from "../../../constants/roles";
import ReasonPhrase from "../../../enums/ReasonPhrase";
import { compareFunction, compareString, hashFunction } from "../../../utils/bcryptHandle";
import User from "../../../models/User";
import { AuthenticatedRequest } from "../../../types/Request";
import jwtHandler from "../../../utils/jwtHandle";
import generateNumber from "../../../utils/generateNumber";

class AuthController {
  static loginHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { studentCode, password } = req.body;
      const user = await User.findOne({ studentCode });

      if (
        !user ||
        (user.role === "admin" && !(await compareFunction(password, user.password))) ||
        (user.role !== "admin" && !compareString(password, user.password))
      ) {
        throw new AuthFailureError("Invalid student code or password!");
      }

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
    } catch (error) {
      next(error);
    }
  };

  //signUpHandle
  static signUpHandle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { studentCode, studentName, studentClass, studentHometown, studentPhone, role } = req.body;
      const duplicate = await User.findOne({ studentCode });

      if (duplicate) {
        return res.status(HttpStatusCode.CONFLICT).json({
          success: false,
          payload: { studentCode, studentName, studentClass, studentHometown, studentPhone, role },
          error: { reason: ReasonPhrase.CONFLICT },
          message: "Student already exists!",
        });
      }

      const isRoleActive = roles.some((r) => role === r);
      if (!isRoleActive) {
        throw new BadRequestError("Role is not active!");
      }

      let password = role === "admin" ? await hashFunction("admin") : generateNumber().toString();

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
      const newUser = await User.findOne({ studentCode });

      return res.status(HttpStatusCode.CREATED).json({
        success: true,
        payload: { ...newUser?.toObject(), password },
        error: null,
        message: "User registered successfully!",
      });
    } catch (error) {
      next(error);
    }
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
