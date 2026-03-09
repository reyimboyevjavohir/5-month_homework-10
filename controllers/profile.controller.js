const bcrypt = require('bcryptjs')
const User = require('../models/user.model')

exports.getMyProfile = async (req, res, next) => {
  try {
    const u = req.user
    return res.json({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      email: u.email,
      avatarUrl: u.avatarUrl,
      role: u.role,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    })
  } catch (e) {
    next(e)
  }
}

exports.updateMyProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, avatarUrl } = req.body

    if (email && String(email).toLowerCase() !== req.user.email) {
      const exists = await User.findOne({ email: String(email).toLowerCase() })
      if (exists) return res.status(409).json({ message: 'Bu email boshqa userda bor' })
      req.user.email = String(email).toLowerCase()
      req.user.isVerified = false
    }

    if (firstName !== undefined) req.user.firstName = firstName
    if (lastName !== undefined) req.user.lastName = lastName
    if (phone !== undefined) req.user.phone = phone
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl

    await req.user.save()
    return res.json({ message: 'Profile updated' })
  } catch (e) {
    next(e)
  }
}

exports.deleteMyProfile = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.user._id })
    return res.json({ message: 'Account deleted' })
  } catch (e) {
    next(e)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'confirmPassword mos emas' })
    }

    const user = await User.findById(req.user._id).select('+password +refreshTokens.tokenHash')
    const ok = await bcrypt.compare(String(currentPassword), user.password)
    if (!ok) return res.status(401).json({ message: 'Current password xato' })

    user.password = await bcrypt.hash(String(newPassword), 10)
    user.refreshTokens = []
    await user.save()
    return res.json({ message: 'Password changed. Qayta login qiling.' })
  } catch (e) {
    next(e)
  }
}
