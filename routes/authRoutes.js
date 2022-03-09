const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
require('../services/passport');

const router = express.Router();

router.post('/sigup', authController.signup);
router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  authController.login
);
router.post('/logout', authController.logout);

module.exports = router;
