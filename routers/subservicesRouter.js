const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {createSubService,getSubServices,getSubServicesByID,editSubService,deleteSubService} = require('../controllers/subservicesController')

router.post('/create',upload.array('files',5),createSubService)
router.get('/getAll',getSubServices)
router.get('/getOne/:id',getSubServicesByID)
router.put('/update/:id',upload.single('file'),editSubService)
router.delete('/delete/:id',deleteSubService)

module.exports = router;