const router = require('express').Router();
const {createBookings,showAllBookingsToAdmin,editBookingByAdmin} = require('../controllers/bookingController');
const {authPass} = require('../controllers/authController');
const {authPassAdmin} = require('../controllers/adminController');

router.post('/',authPass, createBookings);
router.get('/getAll',showAllBookingsToAdmin);
router.put('/edit/:id',authPassAdmin,editBookingByAdmin);

module.exports = router;
