export function HandleError(callback) {
  return (req, res, next) => {
    callback(req, res, next).catch((err) => {
      next({ message: err.message, code: "01", statusCode: err.statusCode });
    });
  };
}
