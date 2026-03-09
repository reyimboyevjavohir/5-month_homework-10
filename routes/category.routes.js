const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const admin = require('../middleware/admin.middleware')
const validate = require('../middleware/validate.middleware')
const controller = require('../controllers/category.controller')
const { createCategorySchema, updateCategorySchema } = require('../validations/category.validation')

const router = Router()

router.get('/', controller.getCategories)
router.get('/:id', controller.getCategoryById)
router.get('/:id/cars', controller.getCategoryCars)

router.post('/', auth, admin, validate(createCategorySchema), controller.createCategory)
router.put('/:id', auth, admin, validate(updateCategorySchema), controller.updateCategory)
router.delete('/:id', auth, admin, controller.deleteCategory)

module.exports = router
