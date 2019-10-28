const nodemailer = require('nodemailer');
const pug = require('pug')
const htmlToText = require('html-to-text');
const juice = require('juice');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }

});

// transport.sendMail({
//     from: 'wes bos',
//     to: "example@example.com",
//     subject: 'Just trying things out',
//     html: '<h1>Hey dude</h1>',
//     text: 'hey dude'
// })


const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);

    const inlined = juice(html)
    return inlined;
};

exports.send = async(options) => {
    // returns pugfile generated into HTML stored in html variable 
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: `wes bost <noreply@wesbos.com>`,
        to: options.user.email,
        subject: options.subject,
        html: html,
        text: `filled in later`,
    }
    const sendMail = promisify(transport.sendMail, transport)
    return sendMail(mailOptions)
};