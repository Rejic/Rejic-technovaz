var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');




//...

 



// Set up Mongoose connection
mongoose.connect('mongodb://Rejic-Technovaz:H1ckfYUw7erN2eq5@cluster0-shard-00-00.yrsrt.mongodb.net:27017,cluster0-shard-00-01.yrsrt.mongodb.net:27017,cluster0-shard-00-02.yrsrt.mongodb.net:27017/<dbname>?ssl=true&replicaSet=atlas-zdsxlf-shard-0&authSource=admin&retryWrites=true&w=majority', 
{
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
}).then( () => {
  console.log('MongoDB is connected....')
}).catch(err => console.log(err));





var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use((req, res, next) => {
  res.locals.url = req.path;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use("/bootstrap", express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

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
