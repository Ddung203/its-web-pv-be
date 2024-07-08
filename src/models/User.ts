import { Schema, Model, model } from "mongoose";

// type UserModel = Model<IUser>;
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
    password: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isOnline: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
  },
  { collection: "users", timestamps: true },
);

/**
  // Giới hạn số lượng người dùng trả về là 10, bỏ qua 5 người dùng đầu tiên, lọc theo lớp học 'CS101', sắp xếp theo tên sinh viên
  const limit = 10;
  const skip = 5;
  const filter = JSON.stringify({ studentClass: 'CS101' });
  const sort = JSON.stringify({ studentName: 1 }); // 1 là tăng dần, -1 là giảm dần

  const url = `/api/users?limit=${limit}&skip=${skip}&filter=${encodeURIComponent(filter)}&sort=${encodeURIComponent(sort)}`;
*/
userSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0, __v: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).countDocuments();
  return { data, count, limit, skip };
};

const User: UserModel = model<IUser, UserModel>("User", userSchema);

export default User;
