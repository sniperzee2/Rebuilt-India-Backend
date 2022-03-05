const SubService = require("../models/subservicesModel");
const Service = require("../models/servicesModel");
const Process = require("../models/processModel");

exports.createSubService = async (req, res) => {
    try{
        const {name, mainDescription,serviceID,discount,processDes} = req.body;
        console.log(req.files)
        console.log(processDes)
        const subService = new SubService({
            name,
            mainDescription,
            image: `/images/${req.files[0].filename.replace(/ /g, "_")}`,
            points: req.body.points || [],
            issues: req.body.issues || [],
            discount,
            headerImg: `/images/${req.files[1].filename.replace(/ /g, "_")}`,
        });

        for(var i = 0; i < processDes.length; i++){
            const process = new Process({
                description: processDes[i],
                image: `/images/${req.files[i+2].filename.replace(/ /g, "_")}`,
            });
            await process.save();
            subService.process.push(process._id);
        }
        
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
                discount: req.body.discount || sub.discount,
                points: req.body.points || sub.points,
                price: req.body.price || sub.price,
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