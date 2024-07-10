import { Joi } from "express-validation";

const playValidator = {
  remove: {
    params: Joi.object({
      playID: Joi.string().length(24).required(),
    }),
  },
};

export default playValidator;
