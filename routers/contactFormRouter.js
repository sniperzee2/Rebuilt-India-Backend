const express = require('express');
const router = express.Router();
const {createRequest,getAllRequests} = require('../controllers/contactFormController')

router.post('/create',createRequest)
router.get('/getAll',getAllRequests)

module.exports = router;