const { Schema, model } = require('mongoose')

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category nomini kiritish majburiy'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug  kiritsh majburiy'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, 'Category rasmini kiritish majburiy'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Category', categorySchema)
