const router = require('express').Router();
const {authPass} = require('../controllers/authController');
const {addToCart,clearCart} = require('../controllers/cartController');

router.post('/addToCart',authPass, addToCart);
router.get('/clearCart',authPass, clearCart);

module.exports = router;