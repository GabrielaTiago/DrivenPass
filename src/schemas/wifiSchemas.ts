import joi from 'joi';

const wifiSchema = joi.object({
  title: joi.string().max(50).trim().required().messages({
    'string.max': 'Title must be less than 50 characters',
    'string.empty': 'Title can not be empty',
    'any.required': 'Title is required',
  }),
  wifiName: joi.string().max(50).trim().required().messages({
    'string.max': 'Wifi name must be less than 50 characters',
    'string.empty': 'Wifi name can not be empty',
    'any.required': 'Wifi name is required',
  }),
  password: joi.string().min(8).trim().required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.empty': 'Password can not be empty',
    'any.required': 'Password is required',
  }),
});

export { wifiSchema };
