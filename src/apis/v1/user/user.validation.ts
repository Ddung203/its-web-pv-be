import { Joi } from "express-validation";

const userValidator = {
  get: {
    params: Joi.object({
      studentCode: Joi.string().required(),
    }),
  },

  update: {
    params: Joi.object({
      studentCode: Joi.string().required(),
    }),
    body: Joi.object({
      studentCode: Joi.string().min(3).max(30).required(),
      studentName: Joi.string().min(3).max(30).required(),
      studentClass: Joi.string().min(3).max(30).required(),
      studentPhone: Joi.string().min(3).max(13).required(),
    }),
  },

  remove: {
    params: Joi.object({
      studentCode: Joi.string().required(),
    }),
  },
};

export default userValidator;
