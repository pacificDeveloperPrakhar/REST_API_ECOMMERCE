module.exports = class appError extends Error {
  constructor(message, errCode) {
    super(message);
    this.message = message;
    this["status code"] = errCode || 500;
    this.isOperational = true;
    Error.captureStackTrace(this,this.constructor)
  }
};
