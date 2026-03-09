const Category = require('../models/category.model')
const Car = require('../models/car.model')

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (e) {
    next(e)
  }
}

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json(categories)
  } catch (e) {
    next(e)
  }
}

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category topilmadi' })
    res.json(category)
  } catch (e) {
    next(e)
  }
}

exports.getCategoryCars = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category topilmadi' })

    const cars = await Car.find({ category: category._id, isActive: true })
      .populate('category')
      .sort({ createdAt: -1 })

    res.json({ category, cars })
  } catch (e) {
    next(e)
  }
}

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!category) return res.status(404).json({ message: 'Category topilmadi' })
    res.json(category)
  } catch (e) {
    next(e)
  }
}

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Category topilmadi' })

    await Car.deleteMany({ category: category._id })
    await Category.deleteOne({ _id: category._id })

    res.json({ message: 'Category va unga tegishli mashinalar o\'chirildi' })
  } catch (e) {
    next(e)
  }
}
