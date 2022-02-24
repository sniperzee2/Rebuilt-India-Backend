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
        from: "shivanshjoshi277@gmail.com",
        tls: {
            rejectUnauthorized: false
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Rebuilt <shivanshjoshi277@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;