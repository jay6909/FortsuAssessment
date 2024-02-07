const formData = require("form-data");
const Mailgun = require("mailgun.js");

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY,
});

exports.sendMail = (req, res) => {
    const { toEmail, fromEmail, subject, message } = req.body;

    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: fromEmail,
        to: [toEmail],
        subject: subject,
        text: message,
    });
};