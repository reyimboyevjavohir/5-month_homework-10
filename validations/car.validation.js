const Joi = require('joi')

exports.createCarSchema = Joi.object({
  category: Joi.string().trim().required(),
  name: Joi.string().trim().min(2).max(120).required(),
  slug: Joi.string().trim().lowercase().min(2).max(140).required(),
  price: Joi.number().min(0).required(),
  tinting: Joi.string().trim().allow(''),
  motor: Joi.string().trim().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  color: Joi.string().trim().required(),
  distance: Joi.number().min(0).required(),
  gearbox: Joi.string().trim().required(),
  description: Joi.string().trim().min(10).required(),
  categoryImage: Joi.string().trim().uri().required(),
  exteriorImage: Joi.string().trim().uri().required(),
  interiorImage: Joi.string().trim().uri().required(),
  isActive: Joi.boolean(),
})

exports.updateCarSchema = Joi.object({
  category: Joi.string().trim(),
  name: Joi.string().trim().min(2).max(120),
  slug: Joi.string().trim().lowercase().min(2).max(140),
  price: Joi.number().min(0),
  tinting: Joi.string().trim().allow(''),
  motor: Joi.string().trim(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  color: Joi.string().trim(),
  distance: Joi.number().min(0),
  gearbox: Joi.string().trim(),
  description: Joi.string().trim().min(10),
  categoryImage: Joi.string().trim().uri(),
  exteriorImage: Joi.string().trim().uri(),
  interiorImage: Joi.string().trim().uri(),
  isActive: Joi.boolean(),
}).min(1)
