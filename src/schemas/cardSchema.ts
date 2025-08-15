import joi from 'joi';

const cardSchema = joi.object({
  nickname: joi.string().max(20).trim().required().messages({
    'string.max': 'Nickname must be less than 20 characters',
    'string.empty': 'Nickname is required',
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
      'string.empty': 'Printed name is required',
      'string.max': 'Printed name must be less than 50 characters',
    }),
  number: joi.string().trim().min(16).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'Number must contain only numbers',
    'string.min': 'Number must be at least 16 digits',
    'string.empty': 'Number is required',
  }),
  cvv: joi.string().min(3).max(3).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'CVV must contain only numbers',
    'string.min': 'CVV must be at least 3 digits',
    'string.max': 'CVV must be at most 3 digits',
    'string.empty': 'CVV is required',
  }),
  expirationDate: joi
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/?(\d{2})$/)
    .required()
    .messages({
      'string.pattern.base': 'Expiration date must be in the format MM/YY',
      'string.empty': 'Expiration date is required',
    }),
  password: joi.string().trim().min(4).max(6).regex(/^\d+$/).required().messages({
    'string.pattern.base': 'Password must contain only numbers',
    'string.min': 'Password must be at least 4 digits',
    'string.max': 'Password must be at most 6 digits',
    'string.empty': 'Password is required',
  }),
  virtual: joi.boolean().required().messages({
    'boolean.empty': 'Virtual is required',
    'boolean.base': 'Virtual must be a boolean',
  }),
  type: joi.string().trim().valid('credit', 'debit', 'both').required().messages({
    'string.empty': 'Type is required',
    'any.only': 'Type must be either credit, debit or both',
  }),
});

export { cardSchema };
