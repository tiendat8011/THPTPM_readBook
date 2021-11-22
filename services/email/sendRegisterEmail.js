const nodemailer = require('nodemailer');
const fs = require('fs') //buildin co san cua nodejs
const hogan = require('hogan.js')
const template = fs.readFileSync('services/email/registerEmailTemplate.hjs', 'utf-8'); //dung tu sever doc vao
const compiledTemplate = hogan.compile(template);

const keys = require('../../config/index');

module.exports.sendRegisterEmail = (user) => {
    console.log(keys);
    const transpost = {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTSL: true,
        requireSSL: true,
        auth: {
            user: keys.email,
            pass: keys.password
        }
    }

    const transporter = nodemailer.createTransport(transpost)
    const mailOptions = {
        form: keys.email,
        // form: "smtp.mailtrap.io",
        to: user.email,
        subject: "Mail xac nhan tai khoan",
        // html: "cam on ban da mua ve"
        html: compiledTemplate.render({
            email: user.email,
            codeConfirm: user.confirmCode
        })
    }

    transporter.sendMail(mailOptions, err => {
        if (err) return console.log(err.message)
        console.log("Email was successfully sent!")
    })
}