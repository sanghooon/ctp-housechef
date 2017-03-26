var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/User');

router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log('USER PROFILE PAGE');
  console.log(req.user);
  res.render('user/profile', {
    title: 'User Profile',
    user: req.user
  });
});

router.get('/signup', notLoggedIn, (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/signup', {
    title: 'User Signup',
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.get('/login', notLoggedIn, (req, res, next) => {
  var messages = req.flash('error');
  res.render('user/login', {
    title: 'User Login',
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/login', notLoggedIn, passport.authenticate('local-user-login', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true //allow flash messages
}));

router.post('/signup', notLoggedIn, passport.authenticate('local-user-signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true //allow flash messages
}));

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if(!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
