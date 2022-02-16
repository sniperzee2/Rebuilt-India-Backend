const CompanyFaq = require("../models/companyFaqModel");

exports.createCompanyFaq = async (req, res) => {
    try{
        const {question,answer} = req.body;
        const faq = new CompanyFaq({
            question,
            answer
        });
        const faqCreated = await faq.save();
        if (faqCreated) {
            res.status(200).json({
                message: "CompanyFaq Created Successfully",
                data: faq
            });
        } else {
            res.status(400).json({
                message: "Company FAQ Creation Failed"
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

exports.getCompanyFaqs = async (req, res) => {
    try{
        const faq = await CompanyFaq.find();
        res.status(200).json({
            message: "CompanyFaqs Fetched Successfully",
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

exports.getCompanyFaqsByID = async (req, res) => {
    try{
        const faq = await CompanyFaq.findById(req.params.id);
        res.status(200).json({
            message: "CompanyFaq Fetched Successfully",
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

exports.editCompanyFaq = async (req, res) => {
    try{
            const f = await CompanyFaq.findById(req.params.id);
            const faq = await CompanyFaq.findByIdAndUpdate(req.params.id, {
                question: req.body.question || f.question,
                answer: req.body.answer || f.answer,
            },{new: true});
        res.status(200).json({
            message: "CompanyFaq Updated Successfully",
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

exports.deleteCompanyFaq = async (req, res) => {
    try{
        await CompanyFaq.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Company FAQ Deleted Successfully",
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}