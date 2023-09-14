import nodemailer from "nodemailer";
import config from "./config.js";

export default class Mail {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: config.nodemailUser,
                pass: config.nodemailPass,
            },
        });
    }

    send = async (email, subject, html) => {
        const result = await this.transport.sendMail({
            from: config.nodemailUser,
            to: email,
            subject,
            html,
        });
        return result;
    };
}
