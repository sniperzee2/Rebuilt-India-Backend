const express = require('express');
const router = express.Router();
const {createRate, getRates,editRate, deleteRate} = require('../controllers/rateController')

router.post('/create',createRate)
router.get('/getAll',getRates)
router.put('/update/:rid/:id',editRate)
router.delete('/delete/:id',deleteRate)

module.exports = router;