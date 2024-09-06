import { Joi } from "express-validation";

const authValidator = {
  login: {
    body: Joi.object({
      studentCode: Joi.string().min(10).max(10).required(),
      password: Joi.string().min(3).max(30).required(),
    }),
  },

  signUp: {
    body: Joi.object({
      studentCode: Joi.string().min(10).max(10).required(),
      studentName: Joi.string().min(3).max(30).required(),
      studentClass: Joi.string().min(3).max(30).required(),
      studentPhone: Joi.string().min(3).max(13).required(),
      studentHometown: Joi.string(),
      studentEmail: Joi.string(),
      studentFacebook: Joi.string(),
      image: Joi.string(),
      role: Joi.string().required(),
    }),
  },
};

export default authValidator;
