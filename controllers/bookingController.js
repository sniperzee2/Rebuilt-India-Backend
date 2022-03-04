const Booking = require("../models/bookingsModel");
const Fullbooking = require("../models/fullBookingInfo");
const User = require("../models/userModel");

exports.createBookings = async (req, res) => {
    try{
        const All = req.body.allBookings
        let b = []
        let fullBooking = await Fullbooking.create({
            priceToPay: req.body.priceToPay,
            user: req.body.userID,
            date: req.body.date,
            time: req.body.time,
        })
        for(let i =0; i<All.length; i++){
            let booking = await Booking.create(All[i])
            fullBooking.bookings.push(booking)
            await fullBooking.save()
        }
        const user = await User.findById(req.body.userID).populate("history");
        user.history.push(fullBooking)
        const userSaved = await user.save()
        if(fullBooking && userSaved){
            res.status(200).json({
                message: "Bookings Created Successfully",
                data: fullBooking
            })
        }else{
            res.status(400).json({
                message: "Bookings Creation Failed"
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

//Get all the bookings of a user
exports.showAllBookingsToAdmin = async (req, res) => {
    try{
        const fullBookings = await Fullbooking.find().populate("user").populate({
            path: "bookings",
            populate: [{
                path: "service",
                model: "Service"
            },{
                path: "subservice",
                model: "Subservice"
            },{
                path: "category",
                model: "Category"
            }]
        });
        if(fullBookings){
            res.status(200).json({
                message: "All Bookings Fetched Successfully",
                data: fullBookings
            })
        }else{
            res.status(400).json({
                message: "Fetching Bookings Failed"
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
            const bookingUpdated = await Booking.findByIdAndUpdate(req.params.id,req.body, {new: true});
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

//Add a new booking from admin side
exports.addAdditionBookingsFromAdmin = async (req, res) => {
    try{
        const FullBooking = await Fullbooking.findById(req.params.id);
        if(!FullBooking){
            return res.status(404).json({
                message: "Booking not found"
            })
        }
        if(req.admin.role === "admin"){
            const booking = await Booking.create(req.body)
            FullBooking.bookings.push(booking) //passing reference of booking to fullbooking
            FullBooking.totalPrice = req.body.totalPrice
            const fullBookingUpdated = await FullBooking.save()
            if(fullBookingUpdated){
                return res.status(200).json({
                    message: "Booking Updated Successfully",
                    data: fullBookingUpdated
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