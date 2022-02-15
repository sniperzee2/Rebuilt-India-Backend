const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {createService,getServices,getServicesByID,editService,deleteService} = require('../controllers/servicesController')

router.post('/create',upload.single('file'),createService)
router.get('/getAll',getServices)
router.get('/getOne/:id',getServicesByID)
router.put('/update/:id',upload.single('file'),editService)
router.delete('/delete/:id',deleteService)

module.exports = router;