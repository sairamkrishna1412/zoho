const AppError = require('../utils/appError');

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  next(new AppError(400, 'You are not logged in. Please login first'));
};
