const Joi = require('joi')

exports.createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  slug: Joi.string().trim().lowercase().min(2).max(120).required(),
  image: Joi.string().trim().uri().required(),
  description: Joi.string().allow('').max(1000),
  order: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
})

exports.updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  slug: Joi.string().trim().lowercase().min(2).max(120),
  image: Joi.string().trim().uri(),
  description: Joi.string().allow('').max(1000),
  order: Joi.number().integer().min(0),
  isActive: Joi.boolean(),
}).min(1)
