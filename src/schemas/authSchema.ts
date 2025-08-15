import joi from 'joi';

const authSchema = joi.object({
  email: joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email can not be empty',
    'any.required': 'Email is required',
  }),
  password: joi
    .string()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{10,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
      'string.empty': 'Password can not be empty',
      'any.required': 'Password is required',
    }),
});

export { authSchema };
