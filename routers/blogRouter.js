const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer')
const {createBlog,getBlogs,getBlogByID,editBlog,deleteBlog} = require('../controllers/blogController')

router.post('/create',upload.single('file'),createBlog)
router.get('/getAll',getBlogs)
router.get('/getOne/:id',getBlogByID)
router.put('/update/:id',upload.single('file'),editBlog)
router.delete('/delete/:id',deleteBlog)

module.exports = router;