import { Schema, Model, model } from "mongoose";

interface PlayModel extends Model<IPlay> {
  List(filter: {
    limit: number;
    skip: number;
    filter: object;
    sort: object;
  }): Promise<{ data: IPlay[]; count: number; limit: number; skip: number }>;
}

const playSchema = new Schema<IPlay, PlayModel>(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    timeOut: { type: Date, default: new Date(Date.now() + 20 * 60000) },
    score: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    interviewScore: { type: Number, default: 0 },
    interviewer: { type: String },
    comment: { type: String },
    endTime: { type: String },
  },
  { collection: "plays", timestamps: true },
);

playSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0 })
    .populate({
      path: "userID",
      select: "studentCode studentName studentClass studentHometown isPassed image",
    })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .select("-__v")
    .exec();
  const count = await this.find(filter).countDocuments();

  return { data, count, limit, skip };
};

const Play: PlayModel = model<IPlay, PlayModel>("Play", playSchema);

export default Play;
