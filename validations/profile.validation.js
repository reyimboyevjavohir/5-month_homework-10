const Joi = require('joi')

const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  avatarUrl: Joi.string().allow('').optional(),
}).min(1)

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(4).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
})

module.exports = { updateProfileSchema, changePasswordSchema }
