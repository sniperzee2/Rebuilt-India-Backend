const Booking = require("../models/bookingsModel");
const Fullbooking = require("../models/fullBookingInfo");
const User = require("../models/userModel");
const pdfKit = require('pdfkit');
const nodemailer = require('nodemailer');
const Cart = require("../models/cartModel");


exports.createBookings = async (req, res) => {
    try {
        const All = req.user.cart
        let b = []
        let fullBooking = await Fullbooking.create({
            priceToPay: req.user.priceToPay,
            user: req.user.id,
            date: req.body.date,
            time: req.body.time,
        })
        for (let i = 0; i < All.length; i++) {
            let booking
            if(All[i].category){
                booking = await Booking.create({
                    service: All[i].service.id,
                    subservice: All[i].subservice.id,
                    category: All[i].category.id,
                    issues: All[i].issues,
                    quantity: All[i].quantity
                })
            }
            else{
                booking = await Booking.create({
                    service: All[i].service.id,
                    subservice: All[i].subservice.id,
                    issues: All[i].issues,
                    quantity: All[i].quantity
                })
            }
            fullBooking.bookings.push(booking)
            await Cart.findByIdAndDelete(All[i]._id)
            await fullBooking.save()
        }
        const user = await User.findById(req.user.id).populate("history");
        user.history.push(fullBooking)
        user.cart = []
        user.priceToPay = 0
        const userSaved = await user.save()
        if (fullBooking && userSaved) {
            res.status(200).json({
                message: "Bookings Created Successfully",
                data: fullBooking
            })
        } else {
            res.status(200).json({
                message: "Bookings Creation Failed"
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

//Get all the bookings of a user
exports.showAllBookingsToAdmin = async (req, res) => {
    try {
        const fullBookings = await Fullbooking.find().populate("user").populate({
            path: "bookings",
            populate: [{
                path: "service",
                model: "Service"
            }, {
                path: "subservice",
                model: "Subservice"
            }, {
                path: "category",
                model: "Category"
            }]
        });
        if (fullBookings) {
            res.status(200).json({
                message: "All Bookings Fetched Successfully",
                data: fullBookings
            })
        } else {
            res.status(400).json({
                message: "Fetching Bookings Failed"
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

exports.editBookingByAdmin = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            res.status(404).json({
                message: "Booking not found"
            })
        }
        if (req.admin.role === "admin") {
            const bookingUpdated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (bookingUpdated) {
                return res.status(200).json({
                    message: "Booking Updated Successfully",
                    data: bookingUpdated
                })
            }
            res.status(400).json({
                message: "Booking Update Failed"
            })
        } else {
            res.status(400).json({
                message: "You are not authorized to perform this action"
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

//Add a new booking from admin side
exports.addAdditionBookingsFromAdmin = async (req, res) => {
    try {
        const FullBooking = await Fullbooking.findById(req.params.id);
        if (!FullBooking) {
            return res.status(404).json({
                message: "Booking not found"
            })
        }
        if (req.admin.role === "admin") {
            const booking = await Booking.create(req.body)
            FullBooking.bookings.push(booking) //passing reference of booking to fullbooking
            FullBooking.totalPrice = req.body.totalPrice
            const fullBookingUpdated = await FullBooking.save()
            if (fullBookingUpdated) {
                return res.status(200).json({
                    message: "Booking Updated Successfully",
                    data: fullBookingUpdated
                })
            }
            res.status(400).json({
                message: "Booking Update Failed"
            })
        } else {
            res.status(400).json({
                message: "You are not authorized to perform this action"
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

exports.createPDF = async (req, res) => {
    const fs = require('fs');

    const user = await User.findById(req.body.userID).populate("history");



    let companyLogo = "./Images/ac.jpeg";
    let fileName = './sample-invoice.pdf';
    let fontNormal = 'Helvetica';
    let fontBold = 'Helvetica-Bold';

    let sellerInfo = {
        "companyName": "Best Sales Pvt. Ltd.",
        "address": "Mumbai Central",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400017",
        "country": "India",
        "contactNo": "+910000000600"
    }

    let customerInfo = {
        "customerName": user.name,
        "address": user.address,
        "city": user.city,
        "state": "Ahmdabad",
        "pincode": user.zipcode,
        "country": "India",
        "contactNo": user.phone
    }

    let orderInfo = {
        "orderNo": "111211",
        "invoiceNo": "MH-MU-1077",
        "invoiceDate": Date.now(),
        // "invoiceTime": fullBookings.time,
        "products": [
            {
                "id": "15785",
                "name": "Acer Aspire E573",
                "company": "Acer",
                "unitPrice": 39999,
                "totalPrice": 39999,
                "qty": 1
            },
            {
                "id": "15786",
                "name": "Dell Magic Mouse WQ1545",
                "company": "Dell",
                "unitPrice": 2999,
                "totalPrice": 5998,
                "qty": 2
            }
        ],
        "totalValue": 45997
    }

    function createPdf() {
        try {

            let pdfDoc = new pdfKit();

            let stream = fs.createWriteStream(fileName);
            pdfDoc.pipe(stream);

            pdfDoc.text("Rebuilt India", 5, 5, { align: "center", width: 600 });
            pdfDoc.image(companyLogo, 25, 20, { width: 50, height: 50 });
            pdfDoc.font(fontBold).text('PARALLELCODES', 7, 75);
            pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
            pdfDoc.fontSize(10).text('11-MAY-2021 10:24 PM', 400, 46, { width: 200 });

            pdfDoc.font(fontBold).text("Sold by:", 7, 100);
            pdfDoc.font(fontNormal).text(sellerInfo.companyName, 7, 115, { width: 250 });
            pdfDoc.text(sellerInfo.address, 7, 130, { width: 250 });
            pdfDoc.text(sellerInfo.city + " " + sellerInfo.pincode, 7, 145, { width: 250 });
            pdfDoc.text(sellerInfo.state + " " + sellerInfo.country, 7, 160, { width: 250 });

            pdfDoc.font(fontBold).text("Customer details:", 400, 100);
            pdfDoc.font(fontNormal).text(customerInfo.customerName, 400, 115, { width: 250 });
            pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });
            pdfDoc.text(customerInfo.city + " " + customerInfo.pincode, 400, 145, { width: 250 });
            pdfDoc.text(customerInfo.state + " " + customerInfo.country, 400, 160, { width: 250 });

            pdfDoc.text("Order No:" + orderInfo.orderNo, 7, 195, { width: 250 });
            pdfDoc.text("Invoice No:" + orderInfo.invoiceNo, 7, 210, { width: 250 });
            pdfDoc.text("Date:" + orderInfo.invoiceDate, 7, 225, { width: 250 });

            pdfDoc.rect(7, 250, 560, 20).fill("#FC427B").stroke("#FC427B");
            pdfDoc.fillColor("#fff").text("ID", 20, 256, { width: 90 });
            pdfDoc.text("Product", 110, 256, { width: 190 });
            pdfDoc.text("Qty", 300, 256, { width: 100 });
            pdfDoc.text("Price", 400, 256, { width: 100 });
            pdfDoc.text("Total Price", 500, 256, { width: 100 });

            let productNo = 1;
            orderInfo.products.forEach(element => {
                console.log("adding", element.name);
                let y = 256 + (productNo * 20);
                pdfDoc.fillColor("#000").text(element.id, 20, y, { width: 90 });
                pdfDoc.text(element.name, 110, y, { width: 190 });
                pdfDoc.text(element.qty, 300, y, { width: 100 });
                pdfDoc.text(element.unitPrice, 400, y, { width: 100 });
                pdfDoc.text(element.totalPrice, 500, y, { width: 100 });
                productNo++;
            });

            pdfDoc.rect(7, 256 + (productNo * 20), 560, 0.2).fillColor("#000").stroke("#000");
            productNo++;

            pdfDoc.font(fontBold).text("Total:", 400, 256 + (productNo * 17));
            pdfDoc.font(fontBold).text(orderInfo.totalValue, 500, 256 + (productNo * 17));

            pdfDoc.end();
            console.log("pdf generate successfully");
        } catch (error) {
            console.log("Error occurred", error);
        }
    }

    createPdf();

    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD, 
        },
        from: "rebuiltindia06@gmail.com",
        tls:{
            rejectUnauthorized:false
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Rebuilt Support <rebuiltindia06@gmail.com>',
        to: "shivanshjoshi277@gmail.com",
        subject: "Invoice for your order",
        attachments: [
            {
                filename: 'invoice.pdf',
                path: fileName
            }
        ]
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
    return res.sendStatus(200)
}