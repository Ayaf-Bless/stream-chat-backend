import Joi, { ObjectSchema } from "joi";

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    "string.base": "Field must be valid",
    "string.required": "Field must be valid",
    "string.email": "Field must be valid"
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(20).messages({
    "string.base": "Password should be of type string",
    "string.min": "at least 4 characters for the password",
    "string.max": "at most 20 characters for the password",
    "string.empty": "Password is a required field"
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords should match",
    "any.required": "Confirm password is a required field"
  })
});

export { emailSchema, passwordSchema };
