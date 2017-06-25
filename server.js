const express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
var app = express();

var routes = require('./routes/index');
var users = require('./routes/users');

app.set('views',path.join(__dirname + 'views'))
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport initialize
app.use(passport.initialize());
app.use(passport.session());


// Express Validator form github
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());


// Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); //success
  res.locals.error_msg = req.flash('error_msg'); //error
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//middleware for routes
app.use('/', routes);
app.use('/users', users);

//initial
// app.get('/', function (req, res) {
//   res.send('Hello World!')
// })

app.listen(8080, function () {
  console.log(' app listening on port 8080...')
})