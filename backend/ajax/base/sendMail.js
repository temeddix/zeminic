const Nodemailer = require('nodemailer');
function sendMail(email,htmltext){
    const mailConfig = {
        host : "smtp.sendgrid.net",
        port : 465,
        secure : true,
        auth : {
            user : "apikey",
            pass : "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"
        }
    };

    let message = {
        from : "no-reply@zeminic.com",
        to : email,
        subject : "Verification Code",
        html : htmltext
    };

    let transporter = Nodemailer.createTransport(mailConfig);
    transporter.sendMail(message);

}

module.exports = sendMail;