import { Schema, Model, model } from "mongoose";

interface StatModel extends Model<IStat> {
  List(filter: {
    limit: number;
    skip: number;
    filter: object;
    sort: object;
  }): Promise<{ data: IStat[]; count: number; limit: number; skip: number }>;
}

const statSchema = new Schema<IStat, StatModel>(
  {
    websiteViews: { type: Number, default: 0 },
  },
  { collection: "stats", timestamps: false },
);

statSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { __v: 0 }).sort(sort).skip(+skip).limit(+limit).exec();
  const count = await this.find(filter).countDocuments();

  return { data, count, limit, skip };
};

const Stat: StatModel = model<IStat, StatModel>("Stat", statSchema);

export default Stat;
