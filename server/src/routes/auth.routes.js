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
    res.redirect('http://localhost:3000/home');
  }
);

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
  req.logout(); // Clears the authenticated session
  res.json({ message: 'Logout successful' });
});
