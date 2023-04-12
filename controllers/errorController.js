module.exports = ({ statusCode, status, message, stack }, _, res, next) => {
  res.status(statusCode | 500).json({
    status: status,
    statusCode: statusCode | 500,
    message: message,
    stack: stack,
  });

  next();
};
