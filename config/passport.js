var passport = require('passport');
var User = require('./../models/User');
var Chef = require('./../models/Chef');
var LocalStrategy = require('passport-local').Strategy;

/* HOW TO STORE USER IN SESSION */
passport.serializeUser((user, done) => {
  User.findOne({ 'email': user.email }, (err, users) => {
    if(users) {
      console.log(`SERIALIZE USER ${users.email}`);
      done(null, user.id);
    }
    else {
      Chef.findOne({ 'email': user.email }, (err, chef) => {
        console.log(`SERIALIZE CHEF ${chef.email}`);
        done(null, user.id);
      });
    }
  });
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(user) {
      done(err, user);
    }
    else {
      Chef.findById(id, (err, chef) => {
        done(err, chef);
      });
    }
  });
});

/* SIGNUP STRATEGY TO CREATE NEW USER */
passport.use('local-user-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true //allows us to pass back the entrie request to callback
}, (req, email, password, done) => {
  req.checkBody('firstName', 'Invalid First Name').notEmpty().isLength({min:3});
  req.checkBody('lastName', 'Invalid Last Name').notEmpty().isLength({min:3});
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min:4});
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
    User.findOne({'email': email}, (err, user) => {
      if(err) {
        return done(err);
      }
      if(user) {
        return done(null, false, {message: 'Email already in use...'});
      }
      else {
        var newUser = new User();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        console.log('USER CREATED');
        console.log(newUser);
        newUser.save((err, result) => {
          if(err) throw err;
          return done(null, newUser);
        });
      }
    });
}));

/* LOGIN STRATEGY FOR USER */
passport.use('local-user-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true //allows us to pass back the entrie request to callback
}, (req, email, password, done) => {
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
    User.findOne({'email': email}, (err, user) => {
      if(err) {
        return done(err);
      }
      if(!user) {
        return done(null, false, {message: 'No User Found...'});
      }
      if(!user.validPassword(password)) {
        return done(null, false, {message: 'Wrong Password...'});
      }
      else {
        console.log('USER LOGGED IN');
        console.log(user);
        return done(null, user);
      }
    });
}));

/* SIGNUP STRATEGY TO CREATE NEW CHEF */
passport.use('local-chef-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true //allows us to pass back the entrie request to callback
}, (req, email, password, done) => {
  req.checkBody('firstName', 'Invalid First Name').notEmpty().isLength({min:3});
  req.checkBody('lastName', 'Invalid Last Name').notEmpty().isLength({min:3});
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min:4});
  req.checkBody('address', 'Invalid Address').notEmpty().isLength({min:10});
  req.checkBody('dateOfBirth', 'Invalid Password').notEmpty();
  req.checkBody('headline', 'Invalid Headline').notEmpty().isLength({min:3});
  req.checkBody('description', 'Minimum Description Length = 50 Characters').notEmpty().isLength({min:50});
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
    Chef.findOne({'email': email}, (err, chef) => {
      if(err) {
        return done(err);
      }
      if(chef) {
        return done(null, false, {message: 'Email already in use...'});
      }
      else {
        var newChef = new Chef();
        newChef.firstName = req.body.firstName;
        newChef.lastName = req.body.lastName;
        newChef.address = req.body.address;
        newChef.dateOfBirth = req.body.dateOfBirth;
        newChef.headline = req.body.headline;
        newChef.description = req.body.description;
        newChef.email = email;
        newChef.password = newChef.encryptPassword(password);
        console.log('CHEF CREATED');
        console.log(newChef);
        newChef.save((err, result) => {
          if(err) throw err;
          return done(null, newChef);
        });
      }
    });
}));

/* LOGIN STRATEGY FOR CHEF */
passport.use('local-chef-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true //allows us to pass back the entrie request to callback
}, (req, email, password, done) => {
  req.checkBody('password', 'Invalid Password').notEmpty();
  var errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages));
  }
    Chef.findOne({'email': email}, (err, chef) => {
      if(err) {
        return done(err);
      }
      if(!chef) {
        return done(null, false, {message: 'No Chef Found...'});
      }
      if(!chef.validPassword(password)) {
        return done(null, false, {message: 'Wrong Password...'});
      }
      else {
        console.log('CHEF LOGGED IN');
        return done(null, chef);
      }
    });
}));
