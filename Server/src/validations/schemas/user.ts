import joi from 'joi';

const validRoles = ['admin', 'public'];

const register = joi.object({
  email: joi
    .string()
    .pattern(new RegExp('(.+)@(.+){2,}.(.+){2,}'))
    .required()
    .trim()
    .messages({
      'string.empty': 'Email is required.',
      'string.pattern.base': 'Email must be a valid email address.',
    }),
  fullname: joi
    .string()
    .max(128)
    .required()
    .trim()
    .messages({
      'string.empty': 'Fullname is required.',
      'string.max': 'Fullname must be at most 128 characters long.',
    }),
  password: joi
    .string()
    .min(8)
    .max(128)
    .required()
    .trim()
    .pattern(
      new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')
    )
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password must be at most 128 characters long.',
      'string.pattern.base':
        'Password must contain at least one number and one special character.',
    }),
  user_role: joi
    .string()
    .valid(...validRoles)
    .required()
    .trim()
    .messages({
      'any.only': 'Invalid role. Allowed values are: admin, public.',
      'string.empty': 'User role is required.',
    }),
});

const login = joi.object({
  email: joi
    .string()
    .pattern(new RegExp('(.+)@(.+){2,}.(.+){2,}'))
    .required()
    .trim()
    .messages({
      'string.empty': 'Email is required.',
      'string.pattern.base': 'Email must be a valid email address.',
    }),
  password: joi
    .string()
    .min(3)
    .max(128)
    .required()
    .trim()
    .pattern(
      new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')
    )
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 3 characters long.',
      'string.max': 'Password must be at most 128 characters long.',
      'string.pattern.base':
        'Password must contain at least one number and one special character.',
    }),
});

const updateProfile = joi.object({
  firstname: joi
    .string()
    .max(128)
    .trim()
    .allow('')
    .messages({
      'string.max': 'First name must be at most 128 characters long.',
    }),
  lastname: joi
    .string()
    .max(128)
    .trim()
    .allow('')
    .messages({
      'string.max': 'Last name must be at most 128 characters long.',
    }),
});

export { login, register, updateProfile };
