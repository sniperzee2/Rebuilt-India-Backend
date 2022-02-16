const express = require('express');
const router = express.Router();
const {createCompanyFaq,getCompanyFaqs,getCompanyFaqsByID,editCompanyFaq,deleteCompanyFaq} = require('../controllers/companyFaqController')

router.post('/create',createCompanyFaq)
router.get('/getAll',getCompanyFaqs)
router.get('/getOne/:id',getCompanyFaqsByID)
router.put('/update/:id',editCompanyFaq)
router.delete('/delete/:id',deleteCompanyFaq)

module.exports = router;