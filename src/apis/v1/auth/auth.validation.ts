import { Joi } from "express-validation";

const authValidator = {
  login: {
    body: Joi.object({
      studentCode: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(3).max(30).required(),
    }),
  },

  signUp: {
    body: Joi.object({
      studentCode: Joi.string().min(3).max(30).required(),
      studentName: Joi.string().min(3).max(30).required(),
      studentClass: Joi.string().min(3).max(30).required(),
      studentHometown: Joi.string(),
      studentPhone: Joi.string().min(3).max(13).required(),
      role: Joi.string().required(),
    }),
  },

  reset: {
    body: Joi.object({
      studentCode: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(3).max(30).required(),
    }),
  },
};

export default authValidator;
