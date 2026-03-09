const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const validate = require('../middleware/validate.middleware')
const { updateProfileSchema, changePasswordSchema } = require('../validations/profile.validation')
const {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,
  changePassword,
} = require('../controllers/profile.controller')

const profileRouter = Router()

profileRouter.get('/', auth, getMyProfile)
profileRouter.put('/', auth, validate(updateProfileSchema), updateMyProfile)
profileRouter.delete('/', auth, deleteMyProfile)
profileRouter.put('/password', auth, validate(changePasswordSchema), changePassword)

module.exports = profileRouter
