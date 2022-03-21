const CoorporateForm = require('../models/coorporateFormModel');

exports.createRequest = async (req, res) => {
    try{
        const {name,email,review} = req.body;
        const form = new CoorporateForm({
            name,
            email,
            phone,
            company
        });
        const formCreated = await form.save();
        if (formCreated) {
            res.status(200).json({
                message: "Request Created Successfully",
                data: formCreated
            });
        } else {
            res.status(400).json({
                message: "Request Creation Failed"
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

exports.getAllRequests = async (req, res) => {
    try{
        const form = await CoorporateForm.find();
        if(form){
            res.status(200).json({
                message: "Request Fetched Successfully",
                data: form
            });
        }else{
            res.status(404).json({
                message: "Request Not Found"
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