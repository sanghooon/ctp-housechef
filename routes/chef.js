var express = require('express');
var router = express.Router();
var passport = require('passport');

var Chef = require('../models/Chef');

router.get('/search', (req, res, next) => {
  Chef.find({}, (err, chef) => {
    if(err) throw err;
    res.render('search', {
      title: 'Search Chefs',
      chefs: chef,
      user: req.user
   });
    console.log('ALL CHEFS REQUESTED');
  });
});

router.get('/search/:id', (req, res, next) => {
  Chef.findById(req.params.id, (err, chef) => {
    res.render('chef/profile', {
      title: `Chef Profile`,
      chef: chef,
      isLoggedIn: res.locals.login
    });
  });
});

router.get('/profile', isLoggedIn, (req, res, next) => {
  console.log('CHEF PROFILE PAGE');
  res.render('chef/profile', {
    title: 'Chef Profile',
    chef: req.user,
    isLoggedIn: res.locals.login
  });
});

router.post('/profile', isLoggedIn, (req, res, next) => {
  var dish = {
    dishTitle: req.body.dishTitle,
    dishDescription: req.body.dishDescription,
    dishPrice: req.body.dishPrice
  };
  Chef.update(
    { _id: req.user._id },
    { $push: { dishes: dish} },
    function(err, result) {
      if(err) throw err;
      console.log(result);
    }
  );
  res.send(`CHEF ${req.user.email} ADDED DISH`);
});

router.get('/signup', notLoggedIn, (req, res, next) => {
  var messages = req.flash('error');
  res.render('chef/signup', {
    title: 'Chef Signup',
    messages: messages,
    hasErrors: messages.length > 0
  });
});
router.get('/login', notLoggedIn, (req, res, next) => {
  var messages = req.flash('error');
  res.render('chef/login', {
    title: 'Chef Login',
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', notLoggedIn, passport.authenticate('local-chef-signup', {
  successRedirect: '/chef/profile',
  failureRedirect: '/chef/signup',
  failureFlash: true //allow flash messages
}));

router.post('/login', notLoggedIn, passport.authenticate('local-chef-login', {
  successRedirect: '/chef/profile',
  failureRedirect: '/chef/login',
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
