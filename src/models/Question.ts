import { Schema, Model, model } from "mongoose";
import shuffleArray from "../utils/shuffleArray";

interface QuestionModel extends Model<IQuestion> {
  List(filter: {
    limit: number;
    skip: number;
    filter: object;
    sort: object;
  }): Promise<{ data: IQuestion[]; count: number; limit: number; skip: number }>;

  Random(numQuestions?: number): Promise<Array<IQuestion>>;
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

questionSchema.statics.List = async function ({
  skip = 0,
  limit = 500,
  sort = { createdAt: -1 },
  filter = {},
}): Promise<{ data: IQuestion[]; count: number; limit: number; skip: number }> {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0, __v: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).countDocuments();
  return { data, count, limit, skip };
};

questionSchema.statics.Random = async function (numQuestions = 20): Promise<Array<IQuestion>> {
  const levels = ["easy", "normal", "medium", "hard"];
  const questionsPerLevel = Math.ceil(numQuestions / levels.length);
  const returnQuestions: Array<IQuestion> = [];

  // Helper function to fetch and shuffle questions
  const fetchAndShuffleQuestions = async (level: string) => {
    let questions = await this.find({ level }).select("-__v -createdAt -updatedAt ").lean();

    questions = questions.map((question) => ({
      ...question,
      userAnswer: 0,
    }));

    return shuffleArray(questions);
  };

  // Ensure enough questions are returned
  while (returnQuestions.length < numQuestions) {
    for (const level of levels) {
      const shuffledQuestions = await fetchAndShuffleQuestions(level);
      const selectedQuestions = shuffledQuestions.slice(0, questionsPerLevel);

      returnQuestions.push(...selectedQuestions);

      if (returnQuestions.length >= numQuestions) break;
    }
  }

  return shuffleArray(returnQuestions).slice(0, numQuestions);
};

const Question: QuestionModel = model<IQuestion, QuestionModel>("Question", questionSchema);

export default Question;
