const Faq = require("../models/faqModel");
const Service = require("../models/servicesModel");

exports.createFaq = async (req, res) => {
    try{
        const {question,answer,serviceID} = req.body;
        const faq = new Faq({
            question,
            answer,
            icon: `${req.protocol}://${req.get(
                "host"
              )}/images/${req.file.filename.replace(/ /g, "_")}`
        });
        const faqCreated = await faq.save();
        const service = await Service.findById(serviceID).populate('faqs');
        service.faqs.push(faqCreated);
        const serviceUpdated = await service.save();
        if (faqCreated && serviceUpdated) {
            res.status(200).json({
                message: "Faq Created Successfully",
                data: faq
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

exports.getFaqs = async (req, res) => {
    try{
        const faq = await Faq.find();
        res.status(200).json({
            message: "Faqs Fetched Successfully",
            data: faq
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getFaqsByID = async (req, res) => {
    try{
        const faq = await Faq.findById(req.params.id);
        res.status(200).json({
            message: "Faq Fetched Successfully",
            data: faq
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.editFaq = async (req, res) => {
    try{
            const f = await Faq.findById(req.params.id);
            const faq = await Faq.findByIdAndUpdate(req.params.id, {
                question: req.body.question || f.question,
                answer: req.body.answer || f.answer,
                icon: `${req.protocol}://${req.get(
                    "host"
                  )}/images/${req.file.filename.replace(/ /g, "_")}` || f.icon
            },{new: true});
        res.status(200).json({
            message: "Faq Updated Successfully",
            data: faq
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteFaq = async (req, res) => {
    try{
        const service = await Service.find().populate('faqs');
        await Faq.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.faqs.filter(faq => {
                if(faq._id == req.params.id){
                    service.faqs.pull(faq);
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