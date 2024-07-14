import { Schema, Model, model } from "mongoose";
import _ from "lodash";

interface QuestionModel extends Model<IQuestion> {
  List(filter: {
    limit: number;
    skip: number;
    filter: object;
    sort: object;
  }): Promise<{ data: IUser[]; count: number; limit: number; skip: number }>;

  Random(numQuestions?: number): any;
}

const questionSchema = new Schema<IQuestion, QuestionModel>(
  {
    code: { type: String, required: false },
    imageURL: { type: String, required: false, default: "" },
    content: { type: String, required: true },
    options: [
      {
        numbering: { type: Number, required: true },
        answer: { type: String, required: true },
      },
    ],
    correctAnswer: { type: Number, required: true },
    level: { type: String, enum: ["easy", "normal", "medium", "hard"], default: "easy" },
  },
  { collection: "questions", timestamps: true },
);

questionSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0, __v: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).countDocuments();
  return { data, count, limit, skip };
};

questionSchema.statics.Random = async function (numQuestions = 20) {
  const levels = ["easy", "normal", "medium", "hard"];
  const questionsPerLevel = Math.ceil(numQuestions / levels.length);

  const returnQuestions: any[] = [];

  for (const level of levels) {
    const questions = await this.find({ level }).exec();
    const shuffledQuestions = _.shuffle(questions);
    const selectedQuestions = shuffledQuestions.slice(0, questionsPerLevel);
    selectedQuestions.forEach((item) => returnQuestions.push({ questionId: item._id, answer: false }));
  }

  return _.shuffle(returnQuestions).slice(0, numQuestions);
};

const Question: QuestionModel = model<IQuestion, QuestionModel>("Question", questionSchema);

export default Question;
