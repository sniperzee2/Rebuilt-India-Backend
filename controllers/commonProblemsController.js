const Service = require("../models/servicesModel");
const Problem = require("../models/commonProblemsModel");

exports.createProblem = async (req, res) => {
    try{
        const {question,answer,serviceID,icon} = req.body;
        const problem = new Problem({
            question,
            answer,
            icon: `/images/${icon}`
        });
        const problemCreated = await problem.save();
        const service = await Service.findById(serviceID).populate('problems');
        service.problems.push(problemCreated);
        const serviceUpdated = await service.save();
        if (problemCreated && serviceUpdated) {
            res.status(200).json({
                message: "Problem Created Successfully",
                data: problem
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

exports.getProblems = async (req, res) => {
    try{
        const problem = await Problem.find();
        res.status(200).json({
            message: "Problems Fetched Successfully",
            data: problem
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.getProblemsByID = async (req, res) => {
    try{
        const problem = await Problem.findById(req.params.id);
        res.status(200).json({
            message: "Problem Fetched Successfully",
            data: problem
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.editProblem = async (req, res) => {
    try{
            const f = await Problem.findById(req.params.id);
            const problem = await Problem.findByIdAndUpdate(req.params.id, {
                question: req.body.question || f.question,
                answer: req.body.answer || f.answer,
                icon: req.body.icon || f.icon
            },{new: true});
        res.status(200).json({
            message: "Problem Updated Successfully",
            data: problem
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}

exports.deleteProblem = async (req, res) => {
    try{
        const service = await Service.find().populate('faqs');
        await Problem.findByIdAndDelete(req.params.id);
        service.forEach(service => {
            service.problems.filter(problem => {
                if(problem._id == req.params.id){
                    service.problems.pull(problem);
                    service.save();
                }
            })
        })
        res.status(200).json({
            message: "SubProblem Deleted Successfully",
        });
    }catch(err){
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}