import joi from 'joi';

const validRoles = ['admin', 'public'];

const register = joi.object({
  email: joi.string().pattern(new RegExp('(.+)@(.+){2,}.(.+){2,}')).required(),
  firstname: joi.string().max(128).required(),
  lastname: joi.string().max(128).required(),
  password: joi
    .string()
    .min(8)
    .max(128)
    .required()
    .pattern(
      new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')
    ),
  user_role: joi
    .string()
    .valid(...validRoles)
    .required()
    .messages({
      'any.only': 'Invalid role. Allowed values are: admin, public',
    }),
});

const login = joi.object({
  email: joi.string().pattern(new RegExp('(.+)@(.+){2,}.(.+){2,}')).required(),
  password: joi
    .string()
    .min(3)
    .max(128)
    .required()
    .pattern(
      new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')
    ),
});

export { login, register };
