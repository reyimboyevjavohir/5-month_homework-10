const { Router } = require('express')
const validate = require('../middleware/validate.middleware')
const {
  registerSchema,
  loginSchema,
  verifySchema,
  refreshSchema,
  forgotStartSchema,
  forgotFinishSchema,
} = require('../validations/auth.validation')
const {
  register,
  login,
  verify,
  logout,
  refreshToken,
  getAccessToken,
  forgotPasswordStart,
  forgotPasswordFinish,
} = require('../controllers/auth.controller')

const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/verify', validate(verifySchema), verify)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/refresh-token', validate(refreshSchema), refreshToken)
authRouter.post('/access-token', validate(refreshSchema), getAccessToken)
authRouter.post('/logout', validate(refreshSchema), logout)
authRouter.post('/forgot-password/start', validate(forgotStartSchema), forgotPasswordStart)
authRouter.post('/forgot-password/finish', validate(forgotFinishSchema), forgotPasswordFinish)

module.exports = authRouter
