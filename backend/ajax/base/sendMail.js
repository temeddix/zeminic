const Nodemailer = require('nodemailer');
async function sendMail(email,htmltext){
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
            from : "no-replay@zeminem.com",
            to : email,
            subject : "인증 요청 메일",
            html : htmltext
        };

        let transporter = Nodemailer.createTransport(mailConfig);
        transporter.sendMail(message);

    } catch(error){
        console.log(error);
        return false;
    }
}

module.exports = sendMail;