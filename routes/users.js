var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("admin/index");
});
router.get('/tours', function(req, res, next) {
    res.render("admin/tours/index");
});
router.get('/users', function(req, res, next) {
    res.render("admin/users/index");
});
router.get('/areas', function(req, res, next) {
    res.render("admin/areas/index");
});
module.exports = router;