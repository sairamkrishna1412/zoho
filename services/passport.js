const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/userModel');

// put user to session
passport.serializeUser(function (user, done) {
  console.log('serialize ran', user.id);
  done(null, user.id);
});

// get user from session
passport.deserializeUser(async function (id, done) {
  console.log('de serialize ran', id);
  const user = await User.findById(id);
  // console.log(user);
  done(null, user);
});

const localVerifyFunc = async function (req, email, password, done) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, {
        message: 'No user with that email. Please sign up.',
      });
    }
    const passMatch = await user.comparePassword(password, user.password);
    if (!passMatch) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    console.log('login verified!');
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
