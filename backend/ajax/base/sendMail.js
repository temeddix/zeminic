const Nodemailer = require('nodemailer');
function sendMail(email,htmltext){
    try {
        const mailConfig = {
            host : "smtp.sendgrid.net",
            port : 587,
            auth : {
                user : "apikey",
                pass : "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"
            },
            requireTLS : true
        };

        let message = {
            from : "no-reply@zeminem.com",
            to : email,
            subject : "Verification Code",
            html : htmltext
        };

        let transporter = Nodemailer.createTransport(mailConfig);
        transporter.sendMail(message);

    } catch(error){
        console.log("Sendmail error",error);
        return false;
    }
}

module.exports = sendMail;