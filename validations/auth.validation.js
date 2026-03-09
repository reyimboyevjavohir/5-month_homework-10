const Joi = require('joi')

const registerSchema = Joi.object({
  firstName: Joi.string().allow('').optional(),
  lastName: Joi.string().allow('').optional(),
  phone: Joi.string().allow('').optional(),
  avatarUrl: Joi.string().allow('').optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().valid('user', 'admin').optional(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
})

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
})

const forgotStartSchema = Joi.object({
  email: Joi.string().email().required(),
})

const forgotFinishSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(4).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
})

module.exports = {
  registerSchema,
  loginSchema,
  verifySchema,
  refreshSchema,
  forgotStartSchema,
  forgotFinishSchema,
}
