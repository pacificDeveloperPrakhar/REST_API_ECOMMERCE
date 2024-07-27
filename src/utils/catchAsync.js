module.exports = function catchAsync(fn) {
  console.log(fn);
  return function (req, res, next) {
    fn(req, res, next).catch(err=>{
      console.log(err)
      next(err)
    });
  };
};
