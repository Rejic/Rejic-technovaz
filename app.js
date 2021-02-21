require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');


var indexRouter = require('./routes/index');

// For sessions
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // session is put there so that to every page cnnction session to be executed

// set passport.js, to require model in app.js only 1 dote ('./models/user') NOT ('../models/user')
const User = require('./models/user');
const passport = require('passport');


// For flash messages
const flash = require('connect-flash');




var app = express();
// Sets "Referrer-Policy: no-referrer"
app.use(helmet());

// compress responses
app.use(compression());

// Set up mongoose connection
mongoose.connect(process.env.DB ,
{
  useNewUrlParser: true, 
  useCreateIndex: true,
  useUnifiedTopology: true,
})
.then( () => {
  console.log('MongoDB connected....');
})
.catch(err => console.log( err ));


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://lets_travell_admin:IKNeJq7bhBm1vnvc@cluster0-06juk.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useCreateIndex: true
//  });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middle for session is set so as to run after every request
app.use(session({
   secret: process.env.SECRET,
   saveUninitialized: false,
   resave: false,
   store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Configure passport Middleware || line 54: initialize for user to use password inside application || 55: to keep user logged in later on
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use(flash());

//CONDITIONAL RENDERING
//if we want the app.use function run only in a specified ROUTE we can code
// app.use('/admin', (req, res, next)... first)
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.url = req.path;
  res.locals.flash = req.flash(), //makes flash functionality available in all our pug template
   next();
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
