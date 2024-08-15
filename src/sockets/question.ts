import CONST from "../constants";
import NAMESPACE from "../enums/Namespaces";
import Play from "../models/Play";
import jwtHandler from "../utils/jwtHandle";
import validObjectId from "../utils/validObjectId";

// question.ts
type DataType = {
  token: any;
  command: any;
  payload: {
    answer: any;
    index: any;
  };
};

const errorWithMessage = (socket: any, message: string) => {
  socket.emit(NAMESPACE.ERROR, {
    message,
  });
};

const scoreCalculation = async (play: any) => {
  const result = await Play.findById(play._id).populate("questions.questionId");
  if (result) {
    let score = 0;
    for (let i = 0; i < play.questions.length; i++) {
      if (play.questions[i].answer === result.questions[i].questionID.correctAnswer) {
        score += 10;
      }
    }
    result.score = score;
    await result.save();
    return result;
  }
};

const handleTokenVerification = async (socket: any, token: any) => {
  try {
    const decoded = await jwtHandler.verifyJWT(token);
    return decoded;
  } catch (error) {
    errorWithMessage(socket, "jwt.verify: Authentication failed!");
  }
};

export default function (socket: any) {
  return async function (data: DataType) {
    try {
      const { token, command } = data;
      if (!token) {
        errorWithMessage(socket, "Authentication failed. Token is missing.");
        return;
      }

      const decoded = await handleTokenVerification(socket, token);
      if (!decoded) {
        return;
      }

      switch (command) {
        case CONST.QUESTION.ANSWER:
          const { answer, index } = data.payload;
          if (answer !== undefined && index !== undefined) {
            try {
              const player = await Play.findOne({ userID: validObjectId(decoded._id) });
              if (player) {
                player.questions[index].answer = +answer;
                player.questions[index].answered = true;
                await player.save();
                await scoreCalculation(player);
              }
            } catch (error) {
              errorWithMessage(socket, "Error processing answer.");
            }
          } else {
            errorWithMessage(socket, "Invalid answer data.");
          }
          break;
        default:
          errorWithMessage(socket, "Invalid command.");
      }
    } catch (e) {
      errorWithMessage(socket, "Error processing request.");
    }
  };
}
