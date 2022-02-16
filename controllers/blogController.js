const Blog = require("../models/blogModel");
const Service = require("../models/servicesModel");

exports.createBlog = async (req, res) => {
    try{
        const {title,author,details,serviceID} = req.body;
        const blog = new Blog({
            title,
            author,
            details,
            image: `${req.protocol}://${req.get(
                "host"
              )}/images/${req.file.filename.replace(/ /g, "_")}`,
            date: new Date().toISOString(),
        });
        const blogCreated = await blog.save();

        const service = await Service.findById(serviceID).populate('blogs');
        service.blogs.push(blogCreated);
        const serviceUpdated = await service.save();

        if (blogCreated && serviceUpdated) {
            res.status(200).json({
                message: "Blog Created and added to Service Successfully",
                data: blogCreated
            });
        } else {
            res.status(400).json({
                message: "Blog Creation Failed"
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getBlogs = async (req, res) => {
    try{
        const blog = await Blog.find();
        res.status(200).json({
            message: "Blog Fetched Successfully",
            data: blog
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getBlogByID = async (req, res) => {
    try{
        const blog = await Blog.findById(req.params.id);
        if(blog){
            res.status(200).json({
                message: "Blog Fetched Successfully",
                data: blog
            });
        }else{
            res.status(404).json({
                message: "Blog Not Found"
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.editBlog = async (req, res) => {
    try{
            const b = await Blog.findById(req.params.id);
            const blog = await Blog.findByIdAndUpdate(req.params.id, {
                title: req.body.title || b.title,
                details: req.body.details || b.details,
                author: req.body.author || b.author,
                image: `${req.protocol}://${req.get(
                    "host"
                  )}/images/${req.file.filename.replace(/ /g, "_")}` || b.image,
            },{new: true});
        res.status(200).json({
            message: "Blog Updated Successfully",
            data: blog
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try{
        const service = await Service.find().populate('blogs');
        await Blog.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.blogs.filter(blog => {
                if(blog._id == req.params.id){
                    service.blogs.pull(blog);
                    service.save();
                }
            })
        })
        res.status(200).json({
            message: "SubService Deleted Successfully",
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}