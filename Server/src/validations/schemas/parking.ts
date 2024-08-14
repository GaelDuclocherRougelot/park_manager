import joi from 'joi';

export const parking = joi.object({
  name: joi.string().min(3).max(100).required().messages({
    'string.empty': 'The name field is required.',
    'string.min': 'The name should have a minimum length of 3 characters.',
    'string.max': 'The name should have a maximum length of 100 characters.',
  }),
  space_per_floor: joi.number().integer().min(1).required().messages({
    'number.base': 'Max spaces per floor should be a number.',
    'number.min': 'There should be at least one space per floor.',
  }),
  floors: joi.number().integer().min(1).required().messages({
    'number.base': 'Max floors should be a number.',
    'number.min': 'There should be at least one floor.',
  }),
  address: joi.string().min(5).max(255).required().messages({
    'string.empty': 'The address field is required.',
    'string.min': 'The address should have a minimum length of 5 characters.',
    'string.max': 'The address should have a maximum length of 255 characters.',
  }),
});

export const parkingEdit = joi.object({
  name: joi.string().max(255).allow('').trim().optional().messages({
    'string.max': 'The name should have a maximum length of 255 characters.',
  }),
  address: joi.string().allow('').trim().optional().max(255).messages({
    'string.max': 'The address should have a maximum length of 255 characters.',
  }),
});
