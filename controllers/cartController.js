const Cart = require('../models/cartModel');
// const Service = require('../models/serviceModel');
const Subservice = require('../models/subservicesModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

exports.addToCart = async (req, res) => {
    try {
        const { operation, service, subservice, category } = req.body;
        const { _id } = req.user;
        const currentUser = await User.findById(_id).populate({
            path: "cart",
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
        })
        const gotCart = currentUser.cart;
        for(let i=0; i<gotCart.length; i++){
            if(category ? gotCart[i].category?.id === category : gotCart[i].subservice.id === subservice){
                
                if(operation === "add"){
                    await Cart.findByIdAndUpdate(gotCart[i]._id, {quantity: gotCart[i].quantity + 1});
                    if(category){
                        currentUser.priceToPay += Number(gotCart[i].category.price);
                    }
                    else{
                        currentUser.priceToPay += Number(gotCart[i].subservice.price);
                    }
                }
                else if(operation === "remove"){
                    if(gotCart[i].quantity > 1){
                        await Cart.findByIdAndUpdate(gotCart[i]._id, {quantity: gotCart[i].quantity - 1});
                        if(category){
                            currentUser.priceToPay -= Number(gotCart[i].category.price);
                        }
                        else{
                            currentUser.priceToPay -= Number(gotCart[i].subservice.price);
                        }
                    }
                    else{
                        if(category){
                            currentUser.priceToPay -= Number(gotCart[i].category.price);
                        }
                        else{
                            currentUser.priceToPay -= Number(gotCart[i].subservice.price);
                        }
                        await Cart.findByIdAndDelete(gotCart[i]._id);
                        // gotCart[i].remove();
                        gotCart.splice(i, 1);
                    }
                }
                await currentUser.save();
                return res.status(201).json({
                    message: "Cart Updated",
                    user: currentUser
                });
            }
        }
        let newCart;
        if(category){
            const newCategory = await Category.findById(category);
            newCart = new Cart({
                service,
                subservice,
                category,
                quantity: 1,
            })
            currentUser.priceToPay += Number(newCategory.price)
        }
        else{
            const newSubservice = await Subservice.findById(subservice);
            let priceToPay = Number(newSubservice.price);
            newCart = new Cart({
                service,
                subservice,
                quantity: 1,
                priceToPay
            })
            
            currentUser.priceToPay += Number(newSubservice.price)
        }
        await newCart.save();
        currentUser.cart.push(newCart);
        await currentUser.save();
        const u = await User.findById(_id).populate({
            path: "cart",
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
        })

        res.status(201).json({
            message: "Cart item added successfully",
            user: u
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

exports.clearCart = async (req, res) => {
    try {
        const { _id } = req.user;
        const currentUser = await User.findById(_id)
        const gotCart = currentUser.cart;
        const len = gotCart.length;
        for(let i=len-1; i>=0; i--){
            await Cart.findByIdAndDelete(gotCart[i]._id);
            // gotCart[i].remove();
            gotCart.splice(i, 1);
        }
        currentUser.priceToPay = 0;
        await currentUser.save();
        res.status(201).json({
            message: "Cart cleared successfully",
            user: currentUser
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}