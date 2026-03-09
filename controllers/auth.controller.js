const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { signAccessToken, signRefreshToken, hashToken } = require('../utils/token')

function createOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function makeOtpHash(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex')
}

async function storeRefreshToken(user, refreshToken) {
  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  await user.save()
}

function userPayload(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  }
}

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatarUrl, email, password, role } = req.body
    const normalizedEmail = String(email).toLowerCase()

    const exists = await User.findOne({ email: normalizedEmail })
    if (exists) return res.status(409).json({ message: 'Bu email bilan user bor' })

    const hash = await bcrypt.hash(String(password), 10)
    const otp = createOtp()

    const user = await User.create({
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
      avatarUrl: avatarUrl || '',
      email: normalizedEmail,
      password: hash,
      role: role === 'admin' ? 'admin' : 'user',
      verification: {
        otpHash: makeOtpHash(otp),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    return res.status(201).json({
      message: 'Registered. Endi verify qiling.',
      user: userPayload(user),
      demoVerifyOtp: otp,
    })
  } catch (e) {
    next(e)
  }
}

exports.verify = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+verification.otpHash +verification.expiresAt')
    if (!user) return res.status(404).json({ message: 'User topilmadi' })
    if (user.isVerified) return res.json({ message: 'User allaqachon verify qilingan' })
    if (!user.verification?.otpHash || !user.verification?.expiresAt) {
      return res.status(400).json({ message: 'Verify OTP topilmadi' })
    }
    if (user.verification.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'Verify OTP muddati o‘tgan' })
    }
    if (makeOtpHash(otp) !== user.verification.otpHash) {
      return res.status(400).json({ message: 'OTP xato' })
    }

    user.isVerified = true
    user.verification.otpHash = null
    user.verification.expiresAt = null
    await user.save()

    return res.json({ message: 'Account verify qilindi' })
  } catch (e) {
    next(e)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')
    if (!user) return res.status(401).json({ message: 'Email yoki parol xato' })

    const ok = await bcrypt.compare(String(password), user.password)
    if (!ok) return res.status(401).json({ message: 'Email yoki parol xato' })
    if (!user.isVerified) return res.status(403).json({ message: 'Account verify qilinmagan' })

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)
    await storeRefreshToken(user, refreshToken)

    return res.json({
      message: 'Logged in',
      accessToken,
      refreshToken,
      user: userPayload(user),
    })
  } catch (e) {
    next(e)
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token yaroqsiz' })
    }

    const user = await User.findById(payload.id).select('+refreshTokens.tokenHash +refreshTokens.expiresAt')
    if (!user) return res.status(401).json({ message: 'User topilmadi' })

    const currentHash = hashToken(refreshToken)
    const tokenDoc = user.refreshTokens.find((item) => item.tokenHash === currentHash)
    if (!tokenDoc) return res.status(401).json({ message: 'Refresh token topilmadi yoki logout qilingan' })
    if (new Date(tokenDoc.expiresAt).getTime() < Date.now()) {
      user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== currentHash)
      await user.save()
      return res.status(401).json({ message: 'Refresh token muddati o‘tgan' })
    }

    const newAccessToken = signAccessToken(user)
    const newRefreshToken = signRefreshToken(user)
    user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== currentHash)
    user.refreshTokens.push({
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await user.save()

    return res.json({
      message: 'Refresh muvaffaqiyatli',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (e) {
    return res.status(401).json({ message: 'Refresh token yaroqsiz yoki muddati o‘tgan' })
  }
}

exports.getAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token yaroqsiz' })
    }

    const user = await User.findById(payload.id).select('+refreshTokens.tokenHash +refreshTokens.expiresAt')
    if (!user) return res.status(401).json({ message: 'User topilmadi' })

    const currentHash = hashToken(refreshToken)
    const tokenDoc = user.refreshTokens.find((item) => item.tokenHash === currentHash)
    if (!tokenDoc || new Date(tokenDoc.expiresAt).getTime() < Date.now()) {
      return res.status(401).json({ message: 'Refresh token yaroqsiz yoki muddati o‘tgan' })
    }

    return res.json({ message: 'Yangi access token', accessToken: signAccessToken(user) })
  } catch (e) {
    return res.status(401).json({ message: 'Refresh token yaroqsiz yoki muddati o‘tgan' })
  }
}

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select('+refreshTokens.tokenHash')
    if (user) {
      const currentHash = hashToken(refreshToken)
      user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== currentHash)
      await user.save()
    }
    return res.json({ message: 'Logout qilindi' })
  } catch (e) {
    return res.status(401).json({ message: 'Refresh token yaroqsiz' })
  }
}

exports.forgotPasswordStart = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+passwordReset.otpHash +passwordReset.expiresAt')
    if (!user) return res.status(404).json({ message: 'User topilmadi' })

    const otp = createOtp()
    user.passwordReset.otpHash = makeOtpHash(otp)
    user.passwordReset.expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    return res.json({ message: 'Forgot password OTP yaratildi', demoOtp: otp, expiresInSeconds: 600 })
  } catch (e) {
    next(e)
  }
}

exports.forgotPasswordFinish = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password +passwordReset.otpHash +passwordReset.expiresAt +refreshTokens.tokenHash')
    if (!user) return res.status(404).json({ message: 'User topilmadi' })
    if (!user.passwordReset.otpHash || !user.passwordReset.expiresAt) {
      return res.status(400).json({ message: 'OTP so‘ralmagan' })
    }
    if (user.passwordReset.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ message: 'OTP muddati o‘tgan' })
    }
    if (makeOtpHash(otp) !== user.passwordReset.otpHash) {
      return res.status(400).json({ message: 'OTP xato' })
    }

    user.password = await bcrypt.hash(String(newPassword), 10)
    user.passwordReset.otpHash = null
    user.passwordReset.expiresAt = null
    user.refreshTokens = []
    await user.save()

    return res.json({ message: 'Parol forgot password orqali yangilandi' })
  } catch (e) {
    next(e)
  }
}
