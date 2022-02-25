const router = require('express').Router();
const {createBookings,showAllBookingsToAdmin,editBookingByAdmin,addAdditionBookingsFromAdmin} = require('../controllers/bookingController');
const {authPass} = require('../controllers/authController');
const {authPassAdmin} = require('../controllers/adminController');

router.post('/',authPass, createBookings);
router.get('/getAll',showAllBookingsToAdmin);
router.put('/edit/:id',authPassAdmin,editBookingByAdmin);
router.post('/add/:id',authPassAdmin,addAdditionBookingsFromAdmin);

module.exports = router;
