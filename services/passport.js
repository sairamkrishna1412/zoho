const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/userModel');

const localVerifyFunc = async function (req, email, password, done) {
  try {
    const user = User.findOne({ email });
    if (!user) {
      return done(null, false, {
        message: 'No user with that email. Please sign up.',
      });
    }
    const passMatch = user.comparePassword(password, user.password);
    if (!passMatch) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  } catch (error) {
    done(error);
  }
};

const localStrategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  localVerifyFunc
);

passport.use('local', localStrategy);
