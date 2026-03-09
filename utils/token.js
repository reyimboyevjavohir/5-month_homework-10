const jwt = require('jsonwebtoken')
const crypto = require('crypto')

function signAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
  )
}

function signRefreshToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
  )
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

module.exports = { signAccessToken, signRefreshToken, hashToken }
