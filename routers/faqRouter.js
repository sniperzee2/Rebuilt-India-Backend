const express = require('express');
const router = express.Router();
const {createFaq,getFaqs,getFaqsByID,editFaq,deleteFaq} = require('../controllers/faqController')

router.post('/create',createFaq)
router.get('/getAll',getFaqs)
router.get('/getOne/:id',getFaqsByID)
router.put('/update/:id',editFaq)
router.delete('/delete/:id',deleteFaq)

module.exports = router;