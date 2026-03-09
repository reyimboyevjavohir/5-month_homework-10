const { Schema, model } = require('mongoose')

const refreshTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
)

const userSchema = new Schema(
  {
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    avatarUrl: { type: String, trim: true, default: '' },

    email: {
      type: String,
      required: [true, 'Emailni kiritng'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "iltoms parolni kiriting"],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    verification: {
      otpHash: { type: String, default: null, select: false },
      expiresAt: { type: Date, default: null, select: false },
    },

    passwordReset: {
      otpHash: { type: String, default: null, select: false },
      expiresAt: { type: Date, default: null, select: false },
    },

    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
    },
  },
  { timestamps: true },
)

module.exports = model('User', userSchema)
