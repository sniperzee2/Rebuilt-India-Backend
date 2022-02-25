const Rate = require("../models/rateModel");
const Service = require("../models/servicesModel");

exports.createRate = async (req, res) => {
    try{
        const {name,points,serviceID} = req.body;
        const rate = new Rate({
            name,
            points
        });
        const rateCreated = await rate.save();
        const service = await Service.findById(serviceID).populate('rates');
        service.rates.push(rateCreated);
        const serviceUpdated = await service.save();
        if (rateCreated && serviceUpdated) {
            res.status(200).json({
                message: "Rate Created Successfully",
                data: rate
            });
        } else {
            res.status(400).json({
                message: "Rate Creation Failed"
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

exports.getRates = async (req, res) => {
    try{
        const rate = await Rate.find();
        res.status(200).json({
            message: "Rates Fetched Successfully",
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

exports.editRate = async (req, res) => {
    try{
            const f = await Rate.findById(req.params.rid);
            f.points.map(point => {
                if(point.id == req.params.id){
                    point.name = req.body.name || point.name;
                    point.price = req.body.price || point.price;
                }
            })
            await f.save();
        res.status(200).json({
            message: "Rate Updated Successfully",
            data: f
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteRate = async (req, res) => {
    try{
        const service = await Service.find().populate('rates');
        await Rate.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.rates.filter(rate => {
                if(rate._id == req.params.id){
                    service.rates.pull(rate);
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