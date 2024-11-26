let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let app = express();
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let inventoryRouter = require('../routes/book'); // Updated router to handle inventory

// Set up MongoDB connection
const mongoose = require('mongoose');
let DB = require('./db');
mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', () => {
    console.log("Connected with MongoDB");
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files setup for Bootstrap and custom CSS
app.use(express.static(path.join(__dirname, '../../public'))); // Serves public files, including CSS
app.use(express.static(path.join(__dirname, '../../node_modules'))); // Serves node_modules for Bootstrap

// Route setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter); // Updated path

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
