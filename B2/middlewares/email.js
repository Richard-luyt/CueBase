import nodemailer from "nodemailer"

export const sendEmail = async options => {
    console.log(process.env.EMAIL_HOST, process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    const mailOptions = {
        from: "CueBase <cuebase026@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html: 
    }
    await transporter.sendMail(mailOptions);
}