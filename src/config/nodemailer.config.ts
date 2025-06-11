import { createTransport } from "nodemailer";
import { emailService } from "./dotenv.config";

interface sendEmailData {
  name: string;
  context: string;
  to: string;
  subject: string;
  htmlContent: string;
}

const transporter = createTransport({
  host: emailService.transporter.host,
  port: emailService.transporter.port,
  auth: {
    user: emailService.transporter.auth.user,
    pass: emailService.transporter.auth.pass
  },
  secure: false,
});

export async function sendEmail(data: sendEmailData) {
  const { name, context, to, subject, htmlContent } = data;
  const mailOptions = {
    from: `${name} <${context}@${emailService.options.from}>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}