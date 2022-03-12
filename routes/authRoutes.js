const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
require('../services/passport');

const router = express.Router();

router.post(
  '/signup',
  authController.signup,
  passport.authenticate('local'),
  authController.login
);

router.post('/login', passport.authenticate('local'), authController.login);
router.post('/logout', authController.logout);

module.exports = router;
