require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cpanelRouter = require('./routes/cpanel');
var toursRouter = require('./routes/tours');
var areasRouter = require('./routes/areas');

const jwtAuth = require("./Auth/AuthMiddleware");

var flash = require("connect-flash");
var app = express();


// Connect MongoDB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
require('./Auth/passport')(passport); // load passport da config

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session and cookie
app.use(session({
    secret: 'tours',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());

//Route
app.use('/', indexRouter);
app.use('/users', jwtAuth.isAuth, usersRouter);
app.use('/cpanel', cpanelRouter);
app.use('/tours', toursRouter);
app.use('/areas', areasRouter);
// jwtAuth.isAuth, jwtAuth.isAdmin,
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