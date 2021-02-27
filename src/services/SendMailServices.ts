import nodemailer, {Transporter} from "nodemailer";
import handlebars from 'handlebars';
import fs from "fs";

class SendMailService {
    private client: Transporter

    constructor(){
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = transporter;
        })        
    }
    async execute (to: String, subject: String, variables: object, path: String){
        const templateFileContent = fs.readFileSync(path).toString("utf8")

        const mailTemplateParse = handlebars.compile(templateFileContent)

        const html = mailTemplateParse({
            description: to,
            title: subject,
            name: variables.name,
            link: variables.link,
            user_id: variables.user_id
        })

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>"
        });

        console.log("Message sent: %s", message.messageId)
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))
    }
}

export default new SendMailService();