const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const admin = require('../middleware/admin.middleware')
const validate = require('../middleware/validate.middleware')
const controller = require('../controllers/car.controller')
const { createCarSchema, updateCarSchema } = require('../validations/car.validation')

const router = Router()

router.get('/', controller.getCars)
router.get('/:id', controller.getCarById)

router.post('/', auth, admin, validate(createCarSchema), controller.createCar)
router.put('/:id', auth, admin, validate(updateCarSchema), controller.updateCar)
router.delete('/:id', auth, admin, controller.deleteCar)

module.exports = router
