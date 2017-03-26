var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var session = require('express-session');
var validator = require('express-validator');

var app = express();

/* MONGOOSE SETUP */
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ctp-housechef');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error: '));
db.once('open', () => {
  console.log('Connected to DB');
});
/* INSERTING PASSPORT STRATEGIES */
require('./config/passport');
/* HANDLEBARS VIEW ENGINE SETUP*/
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
/* BODYPARSER SETUP */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/* VALIDATOR SETUP */
app.use(validator());
/* COOKIE PARSER SETUP */
app.use(cookieParser());
/* SESSION SETUP */
app.use(session({
  secret: 'sang\'ssuperdupersecret',
  resave: false,
  saveUninitialized: false
}));
/* FLASH SETUP */
app.use(flash());
/* PASSPORT SETUP */
app.use(passport.initialize());
app.use(passport.session());
/* PATH SETUP */
app.use(express.static(path.join(__dirname, 'public')));
/* MIDDLEWARE EXECUTED IN ALL REQ CHECK IF AUTHENICATED BY LOGIN VARIABLE*/
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  next();
});
/* ROUTES SETUP */
const home = require('./routes/home');
const user = require('./routes/user');
const chef = require('./routes/chef');
app.use('/user', user);
app.use('/chef', chef);
app.use('/', home);

app.listen(3000, () => {
  console.log('Running on 3000...');
});

module.exports = app;
