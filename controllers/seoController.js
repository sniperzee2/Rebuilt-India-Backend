const Seo = require('../models/seoModel');

exports.createSeo = async (req, res) => {
    try {
        const { title, description, serviceID, city } = req.body;
        const seo = new Seo({
            title,
            description,
            serviceID,
            city
        });
        const seoCreated = await seo.save();
        if (seoCreated) {
            res.status(200).json({
                message: "Seo Created Successfully",
                data: seoCreated
            });
        } else {
            res.status(400).json({
                message: "Seo Creation Failed"
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            status: "error",
            message: err.message
        })
    }
}