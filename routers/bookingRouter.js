const router = require('express').Router();
const {createBookings,showAllBookingsToAdmin,editBookingByAdmin,addAdditionBookingsFromAdmin, createPDF} = require('../controllers/bookingController');
const {authPass} = require('../controllers/authController');
const {authPassAdmin} = require('../controllers/adminController');

router.post('/',authPass, createBookings);
router.get('/getAll',authPassAdmin,showAllBookingsToAdmin);
router.put('/edit/:id',authPassAdmin,editBookingByAdmin);
router.post('/add/:id',authPassAdmin,addAdditionBookingsFromAdmin);
router.post('/pdf',createPDF)

module.exports = router;
