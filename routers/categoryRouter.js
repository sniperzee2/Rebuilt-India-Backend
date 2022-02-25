const express = require('express');
const router = express.Router();
const {createCategory, getCategories,editCategory, deleteCategory} = require('../controllers/categoryController')

router.post('/create',createCategory)
router.get('/getAll',getCategories)
router.put('/update/:rid/:id',editCategory)
router.delete('/delete/:id',deleteCategory)

module.exports = router;