class AppError extends Error {
  constructor(message, statusCode, name) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.name = name;
    this.isOperational = true;
  }
}

module.exports = AppError;
