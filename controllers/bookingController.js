const Booking = require("../models/bookingsModel");
const Service = require("../models/servicesModel");
const SubService = require("../models/subservicesModel");
const User = require("../models/userModel");

exports.createBookings = async (req, res) => {
    try{
        const {serviceID, subServiceID, quantity, priceToPay, technicianName, technicianNumber} = req.body;
        const booking = new Booking({
            service: serviceID,
            subService: subServiceID,
            user: req.user.id,
            quantity,
            priceToPay,
            technicianName,
            technicianNumber,
            status: "Open"
        });
        const bookingCreated = await booking.save();
        const Book = await Booking.findById(bookingCreated._id).populate("service").populate("subService").populate("user");
        console.log(req.user)
        const userHistoryAdded = await req.user.history.push(bookingCreated._id);
        const userUpdated = await User.findByIdAndUpdate(req.user.id, {history: req.user.history}, {new: true});
        
        if (bookingCreated && userHistoryAdded && userUpdated) {
            res.status(200).json({
                message: "Booking Created and added to User History Successfully",
                data: {
                    booking: Book,
                    user: userUpdated
                }
            });
        } else {
            res.status(400).json({
                message: "Booking Creation Failed"
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

exports.showAllBookingsToAdmin = async (req, res) => {
    try{
        const bookings = await Booking.find().populate("service").populate("subService").populate("user");
        if (bookings) {
            res.status(200).json({
                message: "All Bookings Fetched Successfully",
                data: bookings
            });
        } else {
            res.status(400).json({
                message: "No Bookings Found"
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

exports.editBookingByAdmin = async (req, res) => {
    try{
        const booking = await Booking.findById(req.params.id);
        if(!booking){
            res.status(404).json({
                message: "Booking not found"
            })
        }
        if(req.admin.role === "admin"){
            const bookingUpdated = await Booking.findByIdAndUpdate(req.params.id, {
                quantity: req.body.quantity || booking.quantity,
                priceToPay: req.body.priceToPay || booking.priceToPay,
                technichianName: req.body.technichianName || booking.technichianName,
                technichianNumber: req.body.technichianNumber || booking.technichianNumber,
                status: req.body.status || booking.status
            }, {new: true});
            if(bookingUpdated){
                return res.status(200).json({
                    message: "Booking Updated Successfully",
                    data: bookingUpdated
                })
            }
            res.status(400).json({
                message: "Booking Update Failed"
            })
        }else{
            res.status(400).json({
                message: "You are not authorized to perform this action"
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
