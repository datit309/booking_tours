var express = require('express');
var router = express.Router();
var Area = require('../model/tourarea');
var User = require('../model/users');
var Tour = require('../model/tours');
var Tourdetail = require('../model/tourdetail');

var upload = require('../upload/upload');
const valid = require("../Auth/validator");
const { validationResult } = require('express-validator');
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("admin/index");
});

// tours
router.get('/tours', function(req, res, next) {
    Tour.find().populate([{ path: 'TourArea' }, { path: 'TourDetail' }]).exec(function(err, tour) {
        if (err)
            throw err;
        else {
            res.render("admin/tours/index", { errors: null, list: tour });
        }
    });
});
router.get('/tours/add', function(req, res, next) {
    Area.find(function(err, area) {
        if (err)
            throw err;
        else {
            res.render("admin/tours/add", { errors: null, listarea: area });
        }
    });
});
router.post('/tours/add', upload.multipleUpload, valid.validateTour, async function(req, res, next) {
    var errors = validationResult(req);
    if (req.fileValidationError) {
        req.flash('error_msg', req.fileValidationError);
        res.redirect('/cpanel/tours/add');
    } else {
        if (!errors.isEmpty()) {
            Area.find(async function(err, area) {
                if (err)
                    throw err;
                res.render('admin/tours/add', { errors: errors.array(), listarea: area });
            });
        } else {
            var temp = new Tour();

            temp.TourName = req.body.TourName;
            temp.TourDescription = req.body.TourDescription;
            temp.TourDuration = req.body.TourDuration;
            temp.TourDeparture = req.body.TourDeparture;
            temp.TourTransportation = req.body.TourTransportation;
            temp.TourArea = req.body.TourArea;
            temp.TourPolicy = req.body.TourPolicy;
            await req.files.forEach(i => {
                temp.TourImages.push(i.filename);
            });

            temp.TourDetail = null;
            temp.save(function(err, result) {
                if (err)
                    throw err;
                else {
                    req.flash("success_msg", "Đã thêm " + result.TourName);
                    res.redirect("/cpanel/tours");
                }
            });
        }
    }
});
router.get('/tours/addcalendar/:_id', function(req, res, next) {
    Tour.findById(req.params._id, function(err, tour) {
        if (err)
            throw err;
        else {
            res.render("admin/tours/addcalendar", { errors: null, tour: tour });
        }
    });

});
router.post('/tours/addcalendar/:_id', function(req, res, next) {
    var tourdetail = new Tourdetail();
    tourdetail.Date = req.body.Date;
    tourdetail.Time = req.body.Time;
    tourdetail.Available = req.body.Available;
    tourdetail.Price = req.body.Price;
    tourdetail.PriceChildren = req.body.PriceChildren;
    tourdetail.Booked = 0;
    tourdetail.save(function(err, result) {
        if (err) throw err;
        else {
            Tour.findById(req.params._id, function(err, tour) {
                if (err) throw err;
                else {
                    tour.TourDetail.push(result._id);
                    tour.save(function(err) {
                        if (err) throw err;
                        else {
                            req.flash("success_msg", "Đã thêm");
                            res.redirect("/cpanel/tours/");
                        }
                    });
                }
            })
        }
    });
});
router.get('/tours/update/:_id', function(req, res, next) {
    Area.find(async function(err, area) {
        if (err)
            throw err;
        else {
            await Tour.findById(req.params._id, function(err, tour) {
                if (err)
                    throw err;
                else {
                    res.render("admin/tours/update", { errors: null, tour: tour, listarea: area });
                }
            });
        }
    });

});
router.post('/tours/update/:_id', upload.multipleUpload, valid.validateTour, function(req, res, next) {
    Tour.findById(req.params._id, function(err, tour) {
        if (err)
            throw err;
        else {
            var errors = validationResult(req);
            if (req.fileValidationError) {
                req.flash('error_msg', req.fileValidationError);
                res.redirect('/cpanel/tours/update/' + tour._id);
            } else {
                if (!errors.isEmpty()) {
                    Area.find(async function(err, area) {
                        if (err)
                            throw err;
                        res.render('admin/tours/update', { errors: errors.array(), tour: tour, listarea: area });
                    });
                } else {
                    tour.TourName = req.body.TourName;
                    tour.TourDescription = req.body.TourDescription;
                    tour.TourDuration = req.body.TourDuration;
                    tour.TourDeparture = req.body.TourDeparture;
                    tour.TourTransportation = req.body.TourTransportation;
                    tour.TourArea = req.body.TourArea;
                    tour.TourPolicy = req.body.TourPolicy;
                    tour.save(function(err) {
                        if (err)
                            throw err;
                        else {
                            req.flash("success_msg", "Cập nhật thành công");
                            res.redirect("/cpanel/tours/update/" + tour._id);
                        }
                    });
                }
            }
        }
    });
});
router.get('/tours/delete/:_id', function(req, res, next) {
    Tour.findByIdAndDelete(req.params._id, function(err, result) {
        if (err)
            throw err;
        else {
            result.TourImages.forEach(i => {
                fs.unlink('public/uploads/' + i, function(err) {
                    if (err) throw err;
                    console.log('File deleted!');
                });
            });
            req.flash("success_msg", "Đã xóa " + result.TourName);
            res.redirect("/cpanel/tours");
        }
    });
});

// user
router.get('/users', function(req, res, next) {
    User.find(function(err, user) {
        if (err)
            throw err;
        else {
            res.render("admin/users/index", { errors: null, list: user });
        }
    });
});
router.get('/users/update/:_id', function(req, res, next) {
    User.findById(req.params._id, function(err, user) {
        if (err)
            throw err;
        else {
            res.render("admin/users/update", { errors: null, user: user });
        }
    });
});
router.post('/users/update/:_id', function(req, res, next) {
    User.findByIdAndUpdate(req.params._id, {
        $set: {
            // TourName: req.body.TourName,
            // TourDescription: req.body.TourDescription,
            // TourDuration: req.body.TourDuration,
            // TourDeparture: req.body.TourDeparture,
            // TourTransportation: req.body.TourTransportation,
            // TourArea: req.body.TourArea,
            // TourPolicy: req.body.TourPolicy,
            // TourImages: req.body.TourImages,
            // TourDetail: req.body.TourDetail,
        }

    }, function(err, result) {
        if (err)
            throw err;
        else {
            req.flash("success_msg", "Cập nhật thành công");
            res.redirect("/cpanel/users/update/" + result._id);
        }
    });
});
router.get('/users/delete/:_id', function(req, res, next) {
    Tour.findByIdAndDelete(req.params._id, function(err, result) {
        if (err)
            throw err;
        else {
            req.flash("success_msg", "Đã xóa " + result.UserName);
            res.redirect("/cpanel/users");
        }
    });
});


// areas
router.get('/areas', function(req, res, next) {
    Area.find(function(err, area) {
        if (err)
            throw err;
        else {
            res.render("admin/areas/index", { errors: null, list: area });
        }
    });

});
router.get('/areas/add', function(req, res, next) {
    res.render("admin/areas/add", { errors: null, name: null, description: null });
});
router.post('/areas/add', valid.validateArea, function(req, res, next) {
    var errors = validationResult(req);
    if (req.fileValidationError) {
        req.flash('error_msg', req.fileValidationError);
        res.redirect('/cpanel/areas/add');
    } else {
        if (!errors.isEmpty()) {
            res.render('admin/areas/add', { errors: errors.array(), name: req.body.AreaName, description: req.body.AreaDescription });
        } else {
            var area = new Area();
            area.AreaName = req.body.AreaName;
            area.AreaDescription = req.body.AreaDescription;
            area.save(function(err, result) {
                if (err)
                    throw err;
                else {
                    req.flash("success_msg", "Đã thêm " + result.AreaName);
                    res.redirect("/cpanel/areas/add");
                }
            });
        }
    }
});
router.get('/areas/update/:_id', function(req, res, next) {
    Area.findById(req.params._id, function(err, area) {
        if (err)
            throw err;
        else {
            res.render("admin/areas/update", { errors: null, name: area.AreaName, description: area.AreaDescription });
        }
    });
});
router.post('/areas/update/:_id', function(req, res, next) {
    Area.findByIdAndUpdate(req.params._id, {
        $set: {
            AreaName: req.body.AreaName,
            AreaDescription: req.body.AreaDescription,
        }
    }, function(err, result) {
        if (err)
            throw err;
        else {
            req.flash("success_msg", "Cập nhật thành công");
            res.redirect("/cpanel/areas/update/" + result._id);
        }
    });
});
router.get('/areas/delete/:_id', function(req, res, next) {
    Area.findByIdAndDelete(req.params._id, function(err, result) {
        if (err)
            throw err;
        else {
            req.flash("success_msg", "Đã xóa " + result.AreaName);
            res.redirect("/cpanel/areas");
        }
    });
});

module.exports = router;