const Form = require('../models/formModel');

exports.createRequest = async (req, res) => {
    try{
        const {name,phone,address,service} = req.body;
        const form = new Form({
            name,
            phone,
            address,
            service
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
        const form = await Form.find();
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

exports.updateStatus = async (req, res) => {
    try{
        const form = await Form.findById(req.params.id);
        if(form){
            form.status = req.body.status;
            const formUpdated = await form.save();
            if (formUpdated) {
                res.status(200).json({
                    message: "Request Updated Successfully",
                    data: formUpdated
                });
            } else {
                res.status(400).json({
                    message: "Request Updation Failed"
                })
            }
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