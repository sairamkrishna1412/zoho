const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const validator = require('validator');

exports.signup = catchAsync(async (req, res, next) => {
  const { body } = req;

  if (!validator.isEmail(body.email)) {
    return next(new AppError(400, `Please enter a valid email.`));
  }

  let user = await User.findOne({ email: body.email });
  if (user) {
    return next(
      new AppError(400, `User with this email is already registered.`)
    );
  }

  if (body.password.length < 8) {
    return next(
      new AppError(400, `Please enter a password of atleast 8 characters`)
    );
  }

  user = await User.create({
    email: body.email,
    password: body.password,
    secret: body.secret,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.login = (req, res) => {
  console.log('Login Successful.');
  res.redirect('/');
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};
