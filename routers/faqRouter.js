const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {createFaq,getFaqs,getFaqsByID,editFaq,deleteFaq} = require('../controllers/faqController')

router.post('/create',upload.single('file'),createFaq)
router.get('/getAll',getFaqs)
router.get('/getOne/:id',getFaqsByID)
router.put('/update/:id',upload.single('file'),editFaq)
router.delete('/delete/:id',deleteFaq)

module.exports = router;