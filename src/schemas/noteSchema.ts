import joi from 'joi';

const noteSchema = joi.object({
  title: joi.string().trim().max(50).required().messages({
    'string.max': 'Title must be less than 50 characters',
    'string.empty': 'Title can not be empty',
    'any.required': 'Title is required',
  }),
  text: joi.string().trim().max(1000).required().messages({
    'string.max': 'Text must be less than 1000 characters',
    'string.empty': 'Text can not be empty',
    'any.required': 'Text is required',
  }),
});

export { noteSchema };
