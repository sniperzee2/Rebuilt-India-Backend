const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const otpService = require("../utils/otp");
const hashService = require("../utils/hash");


const signToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const { id } = user;
    const data = {
        id
    };
    const token = signToken(data);

    res.status(statusCode).json({
        status: "success",
        token,
        user,
    });
};

exports.SendOTP = async (req, res, next) => {
    const { phone } = req.body;
    if(!phone) return res.status(400).json({ message: "Phone number is required" });
    const otp = await otpService.generateOtp();
    const expires = Date.now() + 1000*60*3;; 
    const data = `${phone}${otp}${expires}`;

    const otpHash = await hashService.hashOtp(data);
    try{
        await otpService.sendOtp(phone, otp);  
        res.status(200).json({
            hash: `${otpHash}.${expires}`,
            phone,
            otp
         });  
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.VerifyOTPOnSignUp = async (req, res, next) => {
    const {otp,hash,phone,name,email,address,password} = req.body;
    console.log(hash)
    if(!otp || !hash || !phone) return res.status(400).json({ message: "Invalid request" });
    const [hashedOtp, expires] = hash.split('.');

    if(Date.now() > +expires) return res.status(400).json({ message: "Otp expired" });

    const data = `${phone}${otp}${expires}`;

    const isValid = await otpService.verifyOtp(data, hashedOtp);

    if(!isValid) return res.status(400).json({ message: "Invalid otp" });

    let userPhone = await User.findOne({ phone });
    let userEmail = await User.findOne({ email });
    if(!userPhone && !userEmail) {
        try{
            const user = await User.create({
                name,
                email,
                phone,
                address,
                password,
            })
            createSendToken(user, 200, res);
        }catch(err){
            console.log(err)
            return res.status(500).json({ message: "Internal server error" });
        }
    }else{
        return res.status(400).json({ message: "User already exists" });
    }
};

exports.loginWithEmail = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                status: "fail",
                message: "Please provide Email and password",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: `Incorrect email or password`,
            });
        }
        console.log(user.password)
        console.log(password)
        const correct = await user.correctPassword(password, user.password);
        createSendToken(user, 200, res);
        if (!correct) {
            return res.status(404).json({
                status: "fail",
                message: `Incorrect email or password`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};

exports.loginWithPhone = async (req, res, next) => {
    try {
        const {otp,hash,phone} = req.body;
        console.log(hash)
        if(!otp || !hash || !phone) return res.status(400).json({ message: "Invalid request" });
        const [hashedOtp, expires] = hash.split('.');
    
        if(Date.now() > +expires) return res.status(400).json({ message: "Otp expired" });
    
        const data = `${phone}${otp}${expires}`;
    
        const isValid = await otpService.verifyOtp(data, hashedOtp);
    
        if(!isValid) return res.status(400).json({ message: "Invalid otp" });

        const user = await User.findOne({ phone });
        if(!user) return res.status(404).json({ message: "User not found" });

        createSendToken(user, 200, res);
    
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.forgotPassword = async(req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({
            status: "fail",
            message: "User with this email does not exist",
        })
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        })

        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return res.status(500).json({
            status: "fail",
            message: "There was an error sending the email. Try again later!",
            error: err.message
        })
    }
}

exports.resetPassword = async(req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(400).json({
            status: "fail",
            message: "Password reset token is invalid or has expired",
        })
    }
    user.password = req.body.password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res)
}

exports.getUserByToken = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
          return res.status(404).send("User Not Found");
        }
    
        res.json({
          user,
        });
      } catch (error) {
        console.log(error);
        res.status(error);
      }
}

exports.authPass = async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = await req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json({
            message: "You aren't Logged In",
        });
    }

    // 2) Verification token
    console.log("My token", token);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    console.log(decoded);
    const currentUser = await User.findById(decoded.id).populate('history');


    // 4) Check if user changed password after the token was issued

    // GRANT ACCESS TO PROTECTED ROUTE

    req.user = currentUser;
    // console.log("This is req.user from middlwwRE", req.user);
    res.locals.user = currentUser;
    console.log("Successfully Passed Middlware");
    next();
};