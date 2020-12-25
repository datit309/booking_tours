var express = require('express');
var router = express.Router();
var Area = require('../model/tourarea');
var User = require('../model/users');
var Tour = require('../model/tours');
var Tourdetail = require('../model/tourdetail');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Area.find().exec(function(err, area) {
        if (err) throw err;
        res.render('area', { title: 'Booking tours', area: area });
    });
});
router.get('/view/:_id', function(req, res, next) {
    Area.findById(req.params._id).exec(function(err, area) {
        if (err) throw err;
        res.render('area-single', { title: 'Booking tours', area: area });
    });
});
module.exports = router;