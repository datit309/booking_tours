var express = require('express');
var router = express.Router();
var Area = require('../model/tourarea');
var User = require('../model/users');
var Tour = require('../model/tours');
var Tourdetail = require('../model/tourdetail');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Tour.find().populate('TourArea').populate('TourDetail').exec(function(err, tour) {
        if (err) throw err;
        res.render('tour', { title: 'Booking tours', tour: tour });
    });
});
router.get('/view/:_id', function(req, res, next) {
    Tour.findById(req.params._id).populate('TourArea').populate('TourDetail').exec(function(err, tour) {
        if (err) throw err;
        res.render('tour-single', { title: 'Booking tours', tour: tour });
    });
});
module.exports = router;