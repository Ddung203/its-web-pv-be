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
  },

  remove: {
    params: Joi.object({
      studentCode: Joi.string().required(),
    }),
  },
};

export default userValidator;
