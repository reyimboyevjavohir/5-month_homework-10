const Car = require('../models/car.model')
const Category = require('../models/category.model')

exports.createCar = async (req, res, next) => {
  try {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(404).json({ message: 'Category topilmadi' })

    const car = await Car.create(req.body)
    const populated = await Car.findById(car._id).populate('category')
    res.status(201).json(populated)
  } catch (e) {
    next(e)
  }
}

exports.getCars = async (req, res, next) => {
  try {
    const filter = { isActive: true }
    if (req.query.category) filter.category = req.query.category

    const cars = await Car.find(filter).populate('category').sort({ createdAt: -1 })
    res.json(cars)
  } catch (e) {
    next(e)
  }
}

exports.getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('category')
    if (!car) return res.status(404).json({ message: 'Mashina topilmadi' })
    res.json(car)
  } catch (e) {
    next(e)
  }
}

exports.updateCar = async (req, res, next) => {
  try {
    if (req.body.category) {
      const category = await Category.findById(req.body.category)
      if (!category) return res.status(404).json({ message: 'Category topilmadi' })
    }

    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category')

    if (!car) return res.status(404).json({ message: 'Mashina topilmadi' })
    res.json(car)
  } catch (e) {
    next(e)
  }
}

exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
    if (!car) return res.status(404).json({ message: 'Mashina topilmadi' })

    await Car.deleteOne({ _id: car._id })
    res.json({ message: 'Mashina o\'chirildi' })
  } catch (e) {
    next(e)
  }
}
