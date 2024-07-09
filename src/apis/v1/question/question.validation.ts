import { Joi } from "express-validation";

const questionValidator = {
  create: {
    body: Joi.object({
      imageURL: Joi.string(),
      content: Joi.string().min(1).max(400).required(),
      options: Joi.array().required(),
      correctAnswer: Joi.string().required(),
      level: Joi.string(),
    }),
  },
  update: {
    body: Joi.object({
      imageURL: Joi.string(),
      content: Joi.string().min(1).max(400).required(),
      options: Joi.array().required(),
      correctAnswer: Joi.string().required(),
      level: Joi.string(),
    }),
  },
};

export default questionValidator;
