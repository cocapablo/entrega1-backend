import mailer from 'nodemailer';
import config from "../../config/config.js"

import logger from '../logs/logger.js';

export default class MailingService {
    constructor(){
        
        console.log("Configuración de mailing: " + JSON.stringify({
            service: config.mailingService,
            host: config.mailingHost,
            //port: 587,
            port : 465,
            user: config.mailingUser,
            pass: config.mailingPassword
        }, null, 2));

        this.client = mailer.createTransport({
            service: config.mailingService,
            host: config.mailingHost,
            port : 465,
            //port: 587,
            auth: {
                user: config.mailingUser,
                pass: config.mailingPassword
            }
        })
    }

    sendSimpleMail = async({from, to, subject, html, attachments=[]})=>{
        let result =  await this.client.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        })
        //console.log(result);

        logger.debug("Resultado de enviar email: " + result.toString());
        
        return result
    }
}