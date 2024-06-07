const express = require('express');
const router = express.Router();
const passport = require('../services/auth.service');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to the client application
    res.redirect('http://localhost:3000/');
  }
);

module.exports = router;