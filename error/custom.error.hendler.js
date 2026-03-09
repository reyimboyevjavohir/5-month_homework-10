module.exports = class CustomErrorHandler extends Error {
  constructor(status, message, error = []) {
    super(message)
    this.status = status
    this.error = error
  }

  static BadRequest(message, error = []) {
    return new CustomErrorHandler(400, message, error)
  }

  static Unauthorized(message, error = []) {
    return new CustomErrorHandler(401, message, error)
  }

  static Forbidden(message, error = []) {
    return new CustomErrorHandler(403, message, error)
  }

  static NotFound(message, error = []) {
    return new CustomErrorHandler(404, message, error)
  }
}
