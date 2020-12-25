const { check, body } = require('express-validator');

let validateRegisterUser = () => {
    return [
        check('user.username', 'username does not Empty').not().isEmpty(),
        check('user.username', 'username must be Alphanumeric').isAlphanumeric(),
        check('user.username', 'username more than 6 degits').isLength({ min: 6 }),
        check('user.email', 'Invalid does not Empty').not().isEmpty(),
        check('user.email', 'Invalid email').isEmail(),
        check('user.birthday', 'Invalid birthday').isISO8601('yyyy-mm-dd'),
        check('user.password', 'password more than 6 degits').isLength({ min: 6 })
    ];
}

let validateLogin = () => {
    return [
        check('user.email', 'Invalid does not Empty').not().isEmpty(),
        check('user.email', 'Invalid email').isEmail(),
        check('user.password', 'password more than 6 degits').isLength({ min: 6 })
    ];
}
let validateArea = [
    body('AreaName', 'Area name Invalid does not Empty').not().isEmpty(),
    body('AreaName', 'Name more than 6 degits').isLength({ min: 6 }),
    body('AreaDescription', 'Descriptioon Invalid does not Empty').not().isEmpty(),
];

let validateTour = [
    body('TourName', 'TourName Invalid does not Empty').not().isEmpty(),
    body('TourDescription', 'TourDescription Invalid does not Empty').not().isEmpty(),
    body('TourDuration', 'TourDuration Invalid does not Empty').not().isEmpty(),
    body('TourDeparture', 'TourDeparture Invalid does not Empty').not().isEmpty(),
    body('TourTransportation', 'TourTransportation Invalid does not Empty').not().isEmpty(),
    body('TourArea', 'TourArea Invalid does not Empty').not().isEmpty(),
    body('TourPolicy', 'TourPolicy Invalid does not Empty').not().isEmpty(),
    // body('TourImages', 'TourImages Invalid does not Empty').not().isEmpty(),
    // body('TourDetail', 'TourDetail Invalid does not Empty').not().isEmpty(),
];



module.exports = {
    validateRegisterUser: validateRegisterUser,
    validateLogin: validateLogin,
    validateArea,
    validateTour
};