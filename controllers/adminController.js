const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");


const signToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (admin, statusCode, res) => {
    const { id } = admin;
    const data = {
        id
    };
    const token = signToken(data);

    res.status(statusCode).json({
        status: "success",
        token,
        admin,
    });
};

exports.registerAdmin = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        let regex = new RegExp('[a-z0-9]+@rebuiltindia.com');
        if (!email || !password || !name) {
            return res.status(404).json({
                status: "fail",
                message: "Email or password is missing or wrong domain",
            });
        }
        const admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(404).json({
                status: "fail",
                message: "Admin already exists",
            });
        }
        let newAdmin;
        if(!regex.test(email)){
            newAdmin = await Admin.create({
                email,
                password,
                name,
                role: "viewer",
            });
        }else{
            newAdmin = await Admin.create(req.body);
        }
        if (!newAdmin) {
            return res.status(404).json({
                status: "fail",
                message: "Admin not created",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Admin created successfully",
            user: newAdmin
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
}

exports.loginWithEmailAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({
                status: "fail",
                message: "Please provide Email and password",
            });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                status: "fail",
                message: `Incorrect email or password`,
            });
        }
        const correct = await admin.correctPassword(password, admin.password);
        createSendToken(admin, 200, res);
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

exports.forgotPassword = async(req, res, next) => {
    // 1) Get admin based on POSTed email
    const admin = await Admin.findOne({ email: req.body.email })
    if (!admin) {
        return res.status(400).json({
            status: "fail",
            message: "Admin with this email does not exist",
        })
    }

    // 2) Generate the random reset token
    const resetToken = admin.createPasswordResetToken()
    await admin.save({ validateBeforeSave: false })

    // 3) Send it to admin's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/admins/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

    try {
        await sendEmail({
            email: admin.email,
            subject: "Your password reset token (valid for 10 min)",
            message,
        })

        res.status(200).json({
            status: "success",
            message: "Token sent to email!",
        })
    } catch (err) {
        admin.passwordResetToken = undefined
        admin.passwordResetExpires = undefined
        await admin.save({ validateBeforeSave: false })

        return res.status(500).json({
            status: "fail",
            message: "There was an error sending the email. Try again later!",
            error: err.message
        })
    }
}

exports.resetPassword = async(req, res, next) => {
    // 1) Get admin based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const admin = await Admin.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    // 2) If token has not expired, and there is admin, set the new password
    if (!admin) {
        return res.status(400).json({
            status: "fail",
            message: "Password reset token is invalid or has expired",
        })
    }
    admin.password = req.body.password
    admin.passwordResetToken = undefined
    admin.passwordResetExpires = undefined
    await admin.save()

    // 3) Update changedPasswordAt property for the admin
    // 4) Log the admin in, send JWT
    createSendToken(admin, 200, res)
}

exports.getAdminByToken = async (req, res, next) => {
    try {
        const admin = req.admin;
        if (!admin) {
          return res.status(404).send("Admin Not Found");
        }
    
        res.json({
          admin,
        });
      } catch (error) {
        console.log(error);
        res.status(error);
      }
}

exports.authPassAdmin = async (req, res, next) => {
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

    // 3) Check if admin still exists
    console.log(decoded);
    const currentAdmin = await Admin.findById(decoded.id);


    // 4) Check if admin changed password after the token was issued

    // GRANT ACCESS TO PROTECTED ROUTE

    req.admin = currentAdmin;
    // console.log("This is req.admin from middlwwRE", req.admin);
    res.locals.admin = currentAdmin;
    console.log("Successfully Passed Middlware");
    next();
};
