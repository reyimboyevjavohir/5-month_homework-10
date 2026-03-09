const { Schema, model, Types } = require('mongoose')

const carSchema = new Schema(
  {
    category: {
      type: Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category id majburiy'],
    },
    name: {
      type: String,
      required: [true, 'Mashina nomi majburiy'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug majburiy'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Narx majburiy'],
      min: [0, 'Narx manfiy bo\'lishi mumkin emas'],
    },
    tinting: {
      type: String,
      default: 'Yo\'q',
      trim: true,
    },
    motor: {
      type: String,
      required: [true, 'Motor majburiy'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Yil majburiy'],
      min: [1900, 'Yil juda kichik'],
      max: [new Date().getFullYear() + 1, 'Yil noto\'g\'ri'],
    },
    color: {
      type: String,
      required: [true, 'Rang majburiy'],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, 'Masofa majburiy'],
      min: [0, 'Masofa manfiy bo\'lmaydi'],
    },
    gearbox: {
      type: String,
      required: [true, 'Gearbox majburiy'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Tavsif majburiy'],
      minlength: [10, 'Tavsif juda qisqa'],
      trim: true,
    },
    categoryImage: {
      type: String,
      required: [true, 'Model turi uchun rasm majburiy'],
      trim: true,
    },
    exteriorImage: {
      type: String,
      required: [true, 'Tashqi 360 rasm majburiy'],
      trim: true,
    },
    interiorImage: {
      type: String,
      required: [true, 'Ichki 360 rasm majburiy'],
      trim: true,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = model('Car', carSchema)
