// module.exports = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (ex) {
//     next(ex);
//   }
// };

module.exports = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
