import { Schema, Model, model } from "mongoose";

interface UserModel extends Model<IUser> {
  List(filter: {
    limit: number;
    skip: number;
    filter: object;
    sort: object;
  }): Promise<{ data: IUser[]; count: number; limit: number; skip: number }>;
}

const userSchema = new Schema<IUser, UserModel>(
  {
    studentCode: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    studentClass: { type: String, required: true },
    studentPhone: { type: String, required: true },
    studentHometown: { type: String, required: false, default: "No information" },
    studentFacebook: { type: String, required: false, default: "No information" },
    studentEmail: { type: String, required: false, default: "No information" },
    password: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin", "interviewer", "guest"], default: "user" },
    isTested: { type: Number, enum: [0, 1], default: 0 },
    isInterviewed: { type: Number, enum: [0, 1], default: 0 },
  },
  { collection: "users", timestamps: true },
);

userSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, __v: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).countDocuments();
  return { data, count, limit, skip };
};

const User: UserModel = model<IUser, UserModel>("User", userSchema);

export default User;
