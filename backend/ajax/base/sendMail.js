const Nodemailer = require('nodemailer');
async function sendMail(email,htmltext){
    try {
        const mailConfig = {
            service : "Gmail",
            host : "smtp.gmail.com",
            port : 587,
            auth : {
                user : "kundukdong@gmail.com",
                pass : "3workingtogether"
            },
            requireTLS : true
        };

        let message = {
            from : "kundukdong@gmail.com",
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