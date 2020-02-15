import * as sgMail from '@sendgrid/mail';

const SENDGRID_HOST="https://www.getvehiclesmart.com/rest/";
const SENDGRID_FROM="au.admin@gmail.com";

let mailer = {
    send : (to: string, subject: string, text: string, html: string) => {
        sgMail.setApiKey(process.env.SG_API_KEY);
        sgMail.send( {
            from: SENDGRID_FROM,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
    }
  };
  
  export default mailer;
  