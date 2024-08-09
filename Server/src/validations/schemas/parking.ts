import joi from 'joi';

const parking = joi.object({
  space_number: joi.number()
});