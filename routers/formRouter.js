const express = require('express');
const router = express.Router();
const {createRequest,getAllRequests,updateStatus} = require('../controllers/formController')

router.post('/create',createRequest)
router.get('/getAll',getAllRequests)
router.put('/update/:id',updateStatus)

module.exports = router;