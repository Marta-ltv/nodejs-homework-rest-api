const Joi = require("joi");

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean().default(false),
});

const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});
const patchSchema = Joi.object({
  favorite: Joi.boolean().required(),
});


module.exports = {
  postSchema,
  putSchema,
  patchSchema
};