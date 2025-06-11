import { createTransport } from "nodemailer";
import { emailService } from "./dotenv.config";

const transporter = createTransport({
  host: emailService.transporter.host,
  port: emailService.transporter.port,
  auth: {
    user: emailService.transporter.auth.user,
    pass: emailService.transporter.auth.pass
  },
  secure: false,
});

export async function sendEmail(context: string, to: string, subject: string, htmlContent: string) {
  const mailOptions = {
    from: `${context}@${emailService.options.from}`,
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