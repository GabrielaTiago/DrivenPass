import joi from 'joi';

const cardSchema = joi.object({
  nickname: joi.string().max(20).trim().required().messages({
    'string.max': 'Nickname must be less than 20 characters',
    'string.empty': 'Nickname can not be empty',
    'any.required': 'Nickname is required',
  }),
  printedName: joi
    .string()
    .trim()
    .max(50)
    .uppercase()
    .regex(/^[A-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Printed name must contain only uppercase letters and spaces',
      'string.empty': 'Printed name can not be empty',
      'string.max': 'Printed name must be less than 50 characters',
      'any.required': 'Printed name is required',
    }),
  number: joi.string().trim().min(16).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'Number must contain only numbers',
    'string.min': 'Number must be at least 16 digits',
    'string.empty': 'Number can not be empty',
    'any.required': 'Number is required',
  }),
  cvv: joi.string().min(3).max(3).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'CVV must contain only numbers',
    'string.min': 'CVV must be at least 3 digits',
    'string.max': 'CVV must be at most 3 digits',
    'string.empty': 'CVV can not be empty',
    'any.required': 'CVV is required',
  }),
  expirationDate: joi
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/?(\d{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'Expiration date must be in the format MM/YY',
      'string.empty': 'Expiration date can not be empty',
      'any.required': 'Expiration date is required',
    }),
  password: joi.string().trim().min(4).max(6).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'Password must contain only numbers',
    'string.min': 'Password must be at least 4 digits',
    'string.max': 'Password must be at most 6 digits',
    'string.empty': 'Password can not be empty',
    'any.required': 'Password is required',
  }),
  virtual: joi.boolean().required().messages({
    'boolean.empty': 'Virtual can not be empty',
    'boolean.base': 'Virtual must be a boolean',
    'any.required': 'Virtual is required',
  }),
  type: joi.string().trim().valid('credit', 'debit', 'both').required().messages({
    'string.empty': 'Type can not be empty',
    'any.only': 'Type must be either credit, debit or both',
    'any.required': 'Type is required',
  }),
});

export { cardSchema };
