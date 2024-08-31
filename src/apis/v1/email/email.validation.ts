import { Joi } from "express-validation";

const emailValidator = {
  feedback: {
    body: Joi.object({
      senderName: Joi.string().min(1).max(100).required(),
      senderEmail: Joi.string().min(1).max(100).required(),
      senderSubject: Joi.string().min(1).max(100).required(),
      senderMessage: Joi.string().min(10).max(100).required(),
    }),
  },
};

export default emailValidator;
