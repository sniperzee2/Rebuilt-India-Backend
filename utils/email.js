const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD, 
        },
        from: "rebuiltindia06@gmail.com"
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Rebuilt Support <rebuiltindia06@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;