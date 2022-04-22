const Service = require("../models/servicesModel");
const Seo = require("../models/seoModel");

exports.createService = async (req, res) => {
    try{
        const {name, description} = req.body;
        const service = new Service({
            name,
            description,
            image: `/images/${req.file.filename.replace(/ /g, "_")}`,
        });
        const serviceCreated = await service.save();
        if (serviceCreated) {
            res.status(200).json({
                message: "Service Created Successfully",
                data: service
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

exports.getServices = async (req, res) => {
    try{
        const services = await Service.find().populate({
            path: 'subServices',
            populate: [{
                path: 'process',
                model: 'Process'
            },{
                path: 'categories',
                model: 'Category'
            }]
        }).populate('faqs').populate('blogs').populate('problems').populate('rates');
        res.status(200).json({
            message: "Services Fetched Successfully",
            data: services
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getServicesByID = async (req, res) => {
    try{
    const service = await Service.findById(req.params.id).populate({
        path: 'subServices',
        populate: [{
            path: 'process',
            model: 'Process'
        },{
            path: 'categories',
            model: 'Category'
        }]
    }).populate('faqs').populate('blogs').populate('problems').populate('rates');

    const seo = await Seo.findOne({serviceID: req.params.id, city: req.params.city});
        res.status(200).json({
            message: "Service Fetched Successfully",
            data: service,
            meta: seo
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.editService = async (req, res) => {
    try{
            const s = await Service.findById(req.params.id);
            let service;
            if(req.file){
                service = await Service.findByIdAndUpdate(req.params.id, {
                    name: req.body.name || s.name,
                    description: req.body.description || s.description,
                    image: `/images/${req.file?.filename.replace(/ /g, "_")}` || s.image,
                    slug: req.body.slug || s.slug
                },{new: true});
            }else{
                service = await Service.findByIdAndUpdate(req.params.id, {
                    name: req.body.name || s.name,
                    description: req.body.description || s.description,
                    slug: req.body.slug || s.slug
                },{new: true});
            }
        res.status(200).json({
            message: "Service Updated Successfully",
            data: service
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteService = async (req, res) => {
    try{
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Service Deleted Successfully",
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}