module.exports = class appError extends Error {
  constructor(message, errCode,errStack=null) {
    super(message);
    this.message = message;
    this["status code"] = errCode || 500;
    this.isOperational = true;
    this.errStack=errStack||null
    Error.captureStackTrace(this,this.constructor)
  }
};
