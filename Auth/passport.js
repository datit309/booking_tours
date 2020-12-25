var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const jwtHelper = require("./Authencation");
const AuthControl = require("./AuthController");
// Thời gian sống của token
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "TranTanDatNodejs";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || "TranTanDatNodejs";
let tokenList = {};
var request = require('request');
var User = require('../model/users');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        User.findById(_id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            User.findOne({ Username: username }, async function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('error_msg', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                if (!jwtHelper.validPassword(password, user.Password))
                    return done(null, false, req.flash('error_msg', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                const userFakeData = {
                    _id: user._id,
                    Username: user.Username,
                    FirstName: user.FirstName,
                    LastName: user.LastName,
                    Email: user.Email
                };

                const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
                const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenSecret, refreshTokenLife);
                user.Token.access_token = accessToken;
                user.Token.refresh_token = refreshToken;
                user.save();
                return done(null, user);
            });

        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            process.nextTick(function() {
                User.findOne({ Username: username }, async function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('error_msg', 'Username  đã tồn tại .'));
                    }
                    await User.findOne({ Email: req.body.email }, function(err1, user1) {
                        if (err1)
                            return done(err1);
                        if (user1) {
                            return done(null, false, req.flash('error_msg', 'Email  đã tồn tại .'));
                        } else {
                            var newUser = new User();
                            newUser.Username = username;
                            newUser.Password = jwtHelper.generateHash(password);
                            newUser.Email = req.body.email;
                            newUser.FirstName = req.body.firstname;
                            newUser.LastName = req.body.lastname;
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser, req.flash('success_msg', 'Đăng ký thành công.'));
                            });
                        }

                    });

                });
            });

        }));
}