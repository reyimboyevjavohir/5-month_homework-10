const CustomErrorHandler = require('../error/custom.error.hendler')

module.exports = function (error, req, res, next) {
  if (error instanceof CustomErrorHandler) {
    return res.status(error.status || 400).json({
      message: error.message,
      errors: error.error,
    })
  }

  if (error?.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details?.map((item) => item.message) || [error.message],
    })
  }

  if (error?.name === 'CastError') {
    return res.status(400).json({ message: 'Noto‘g‘ri ID format' })
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Duplicate ma‘lumot yuborildi' })
  }

  return res.status(error.status || 500).json({
    message: error.message || 'Server error',
  })
}
