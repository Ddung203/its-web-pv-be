import { Schema, Model, model } from "mongoose";

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    studentCode: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentClass: { type: String, required: true },
    studentPhone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isOnline: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  },
  { collection: "users", timestamps: true },
);

const User: UserModel = model<IUser, UserModel>("User", userSchema);

export default User;
