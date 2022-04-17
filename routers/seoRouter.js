const express = require('express');
const router = express.Router();
const {createSeo} = require('../controllers/seoController')

router.post('/',createSeo);

module.exports = router;