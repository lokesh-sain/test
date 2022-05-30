const nodemailer = require('nodemailer');

async function sendMail({from,to,subject,text,html}){
    let success=true;
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      });

      transporter.verify(function(error, success) {
        if (error) {
           return success;
        } else {
            let mailOptions = {
                from:`QuickShare - <${from}>`,
                to:to,
                subject:subject,
                text:text,
                html:html
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return success;
                }
                console.log(info);
            success=true;
            return success;
        });
        }
     });
}

module.exports = sendMail;