const Service = require("../models/servicesModel");

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
        const services = await Service.find().populate('subServices').populate('faqs').populate('blogs').populate('problems').populate('rates');
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
    const service = await Service.findById(req.params.id).populate('subServices').populate('faqs').populate('blogs').populate('problems').populate('rates');
        res.status(200).json({
            message: "Service Fetched Successfully",
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

exports.editService = async (req, res) => {
    try{
            const s = await Service.findById(req.params.id);
            const service = await Service.findByIdAndUpdate(req.params.id, {
                name: req.body.name || s.name,
                description: req.body.description || s.description,
                image: `/images/${req.file?.filename.replace(/ /g, "_")}` || s.image,
            },{new: true});
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