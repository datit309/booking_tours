var express = require('express');
var router = express.Router();
var Area = require('../model/tourarea');
var User = require('../model/users');
var Tour = require('../model/tours');
var Tourdetail = require('../model/tourdetail');

var passport = require('passport');
const jwtAuth = require("../Auth/Authencation");
const AuthControl = require("../Auth/AuthController");
const { route } = require('./cpanel');

/* GET home page. */
router.get('/', function(req, res, next) {
    Tour.find().populate('TourArea').populate('TourDetail').exec(function(err, tour) {
        if (err) throw err;
        res.render('index', { title: 'Booking tours', tour: tour });
    });
});
router.get('/login', function(req, res, next) {
    res.render('login', { user: req.user });
}).post('/login', passport.authenticate('local-login', {
    successRedirect: '/cpanel',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/signup', function(req, res, next) {
    res.render('signup', { success_msg: req.flash('success_msg'), user: req.user });
}).post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login', // Điều hướng tới trang hiển thị login
    failureRedirect: '/signup', // Trở lại trang đăng ký nếu lỗi
    failureFlash: true
}));

router.get('/logout', jwtAuth.isLoggedIn, function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;