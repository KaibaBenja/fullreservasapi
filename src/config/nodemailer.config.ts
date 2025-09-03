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
  auth: {
    user: "BTc6Jm827vsHKZds72c6c54b@fullreservas.com",
    pass: "RFSEZRUHfmK4Jw4W2QBzM3nTXgTKxcNW"
  },
  secure: false,
  requireTLS: true
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error de conexión SMTP:', error);
    console.error('  Mensaje:', error.message);
    console.error('  Nombre de error:', error.name);
    // Agrega el stack trace para un debug más profundo
    console.error('  Detalles (stack trace):', error.stack); 
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
  
  // Log de las opciones de correo para depuración
  console.log('Intentando enviar correo con las siguientes opciones:');
  console.log('  FROM:', mailOptions.from);
  console.log('  TO:', mailOptions.to);
  console.log('  SUBJECT:', mailOptions.subject);
  try {
    const info = await transporter.sendMail(mailOptions);
    // Log cuando el envío es exitoso
    console.log("Correo enviado exitosamente. ID del mensaje:", info.messageId);
    return info;
  } catch (error) {
    if (error) {
      console.error("Error al enviar correo:", error);
    }
    throw error;
  }
}