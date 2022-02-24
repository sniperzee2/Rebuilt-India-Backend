const SubService = require("../models/subservicesModel");
const Service = require("../models/servicesModel");

exports.createSubService = async (req, res) => {
    try{
        const {name, mainDescription,serviceID,points,discount,price} = req.body;

        const subService = new SubService({
            name,
            mainDescription,
            image: `/images/${req.file.filename.replace(/ /g, "_")}`,
            points,
            discount,
            price
        });
        const serviceCreated = await subService.save();

        const service = await Service.findById(serviceID).populate('subServices');
        service.subServices.push(serviceCreated);
        const serviceUpdated = await service.save();

        if (serviceCreated && serviceUpdated) {
            res.status(200).json({
                message: "SubService Created and added to Service Successfully",
                data: subService
            });
        } else {
            res.status(400).json({
                message: "SubService Creation Failed"
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

exports.getSubServices = async (req, res) => {
    try{
        const subServices = await SubService.find();
        res.status(200).json({
            message: "SubServices Fetched Successfully",
            data: subServices
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getSubServicesByID = async (req, res) => {
    try{
        const subService = await SubService.findById(req.params.id);
        if(subService){
            res.status(200).json({
                message: "SubService Fetched Successfully",
                data: subService
            });
        }else{
            res.status(404).json({
                message: "SubService Not Found"
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

exports.editSubService = async (req, res) => {
    try{
            const sub = await SubService.findById(req.params.id);
            const subService = await SubService.findByIdAndUpdate(req.params.id, {
                name: req.body.name || sub.name,
                description: req.body.description || sub.description,
                image: `/images/${req.file?.filename.replace(/ /g, "_")}` || sub.image,
                discount: req.body.discount || sub.discount,
                points: req.body.points || sub.points,
                price: req.body.price || sub.price
            },{new: true});
        res.status(200).json({
            message: "SubService Updated Successfully",
            data: subService
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteSubService = async (req, res) => {
    try{
        const service = await Service.find().populate('subServices');
        await SubService.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.subServices.filter(subService => {
                if(subService._id == req.params.id){
                    service.subServices.pull(subService);
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