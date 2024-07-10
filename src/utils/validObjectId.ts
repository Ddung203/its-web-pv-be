import mongoose from "mongoose";
import { BadRequestError } from "~/responses/error";

const validObjectId = (IDstring: string = "") => {
  if (!(typeof IDstring === "string" && /^[a-fA-F0-9]{24}$/.test(IDstring))) {
    throw new BadRequestError("Invalid Object ID!");
  }

  return new mongoose.Types.ObjectId(IDstring);
};

export default validObjectId;
