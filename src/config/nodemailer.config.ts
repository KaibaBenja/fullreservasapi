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
  host: "smtp.envialosimple.email",
  port: 587,
  secure: false,
  auth: {
    user: "BTc6Jm827vsHKZds72c6c54b@fullreservas.com",
    pass: "RFSEZRUHfmK4Jw4W2QBzM3nTXgTKxcNW"
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error de conexión SMTP:', error);
  } else {
    console.log('Conexión SMTP OK — servidor listo:', success);
  }
});

export async function sendEmail(data: sendEmailData) {
  const { name, context, to, subject, htmlContent } = data;
  const mailOptions = {
    from: `${name} <${context}@fullreservas.com>`,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw error;
  }
}