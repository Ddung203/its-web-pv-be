import { Joi } from "express-validation";

const authValidator = {
  login: {
    body: Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),
  },
};

export default authValidator;
