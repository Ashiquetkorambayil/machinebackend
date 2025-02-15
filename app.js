var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var connectDB = require('./config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/userRouter');
var productRouter = require('./routes/productRouter');

connectDB();

var app = express();
var server = require('http').createServer(app); // Create HTTP server

// Initialize socket.io
const { initSocket, sendNotification } = require("./socket");
const io = initSocket(server);

app.use(cors({ origin: '*' }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Export `app` and `server`
module.exports = { app, server, sendNotification };
