const Category = require("../models/categoryModel");
const SubService = require("../models/subservicesModel");

exports.createCategory = async (req, res) => {
    try{
        const {name,price,subserviceID} = req.body;
        const category = new Category({
            name,
            price
        })
        const c = await category.save();
        const subservice = await SubService.findById(subserviceID).populate('categories');
        subservice.categories.push(c);
        const s = await subservice.save();
        if (c && s) {
            return res.status(200).json({
                message: "Category Created Successfully",
                data: c
            });
        }else{
            return res.status(400).json({
                message: "Category Creation Failed"
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

exports.getCategories = async (req, res) => {
    try{
        const rate = await Category.find();
        res.status(200).json({
            message: "Categories Fetched Successfully",
            data: rate
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.editCategory = async (req, res) => {
    try{
            const f = await Category.findById(req.params.id);
            f.name = req.body.name || f.name;
            f.price = req.body.price || f.price;
            const saved = await f.save();
            if(saved){
                res.status(200).json({
                    message: "Category Updated Successfully",
                    data: f
                });
            }else{
                res.status(400).json({
                    message: "Category Updation Failed"
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

exports.deleteCategory = async (req, res) => {
    try{
        const service = await SubService.find().populate('categories');
        await Category.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.categories.filter(category => {
                if(category._id == req.params.id){
                    service.categories.pull(category);
                    service.save();
                }
            })
        })
        res.status(200).json({
            message: "Rate Deleted Successfully",
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}