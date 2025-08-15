import joi from 'joi';

const credentialSchema = joi.object({
  title: joi.string().trim().required().messages({
    'string.empty': 'Title can not be empty',
    'any.required': 'Title is required',
  }),
  url: joi.string().trim().required().messages({
    'string.empty': 'URL can not be empty',
    'any.required': 'URL is required',
  }),
  username: joi.string().trim().required().messages({
    'string.empty': 'Username can not be empty',
    'any.required': 'Username is required',
  }),
  password: joi.string().trim().required().messages({
    'string.empty': 'Password can not be empty',
    'any.required': 'Password is required',
  }),
});

export { credentialSchema };
