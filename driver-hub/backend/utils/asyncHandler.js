// forwards errors from async route handlers to errorHandler
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);