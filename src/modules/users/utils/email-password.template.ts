export function generateHtml(password: string) {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contraseña Restablecida</title>
    </head>
    <body style="
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
    ">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td>
            <!-- Main container -->
            <div style="
              background: white;
              padding: 48px 40px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1), 0 8px 16px rgba(14, 165, 233, 0.05);
              text-align: center;
              border: 1px solid rgba(14, 165, 233, 0.1);
              position: relative;
              overflow: hidden;
            ">
              
              <!-- Background decoration -->
              <div style="
                position: absolute;
                top: -50px;
                right: -50px;
                width: 100px;
                height: 100px;
                background: linear-gradient(135deg, #0ea5e9, #0284c7);
                border-radius: 50%;
                opacity: 0.1;
              "></div>
              
              <!-- Lock icon using Unicode -->
              <div style="margin-bottom: 32px;">
                <div style="
                  width: 96px;
                  height: 96px;
                  background: linear-gradient(135deg, #0ea5e9, #0284c7);
                  border-radius: 50%;
                  display: inline-block;
                  position: relative;
                  vertical-align: middle;
                  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
                  line-height: 96px;
                ">
                  <span style="
                    color: white;
                    font-size: 48px;
                    font-weight: bold;
                    vertical-align: middle;
                  ">🔒</span>
                </div>
              </div>
              
              <!-- Title -->
              <h1 style="
                font-size: 32px;
                font-weight: 800;
                color: #0c4a6e;
                margin: 0 0 20px 0;
                line-height: 1.2;
              ">Contraseña Restablecida</h1>
              
              <!-- Description -->
              <p style="
                font-size: 18px;
                color: #64748b;
                margin: 0 0 40px 0;
                line-height: 1.6;
                max-width: 480px;
                margin-left: auto;
                margin-right: auto;
              ">Tu contraseña ha sido restablecida exitosamente. Utiliza la siguiente contraseña temporal para acceder a tu cuenta.</p>

              <!-- Password details card -->
              <div style="
                background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                padding: 40px 32px;
                border-radius: 16px;
                margin-bottom: 40px;
                border: 2px solid #bae6fd;
                position: relative;
                overflow: hidden;
              ">
                <!-- Background pattern -->
                <div style="
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background-image: radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
                                    radial-gradient(circle at 80% 20%, rgba(2, 132, 199, 0.1) 0%, transparent 50%);
                "></div>
                
                <!-- Password header -->
                <div style="margin-bottom: 20px; position: relative;">
                  <span style="
                    color: #0c4a6e;
                    font-size: 24px;
                    vertical-align: middle;
                    margin-right: 12px;
                  ">🔑</span>
                  <span style="
                    font-weight: 700;
                    color: #0c4a6e;
                    font-size: 18px;
                    vertical-align: middle;
                  ">Tu Nueva Contraseña</span>
                </div>
                
                <!-- Password code -->
                <div style="
                  font-size: 40px;
                  font-weight: 900;
                  color: #0c4a6e;
                  margin-bottom: 24px;
                  letter-spacing: 0.15em;
                  font-family: 'Courier New', monospace;
                  background: white;
                  padding: 20px 24px;
                  border-radius: 12px;
                  display: inline-block;
                  border: 3px solid #0ea5e9;
                  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
                  position: relative;
                ">${password}</div>
              </div>

              <!-- Instructions -->
              <div style="
                background: linear-gradient(135deg, #f8fafc, #f1f5f9);
                padding: 32px 28px;
                border-radius: 12px;
                margin-bottom: 32px;
                border-left: 6px solid #0ea5e9;
                box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
                text-align: left;
              ">
                <p style="
                  font-weight: 700;
                  margin: 0 0 16px 0;
                  color: #1e293b;
                  font-size: 18px;
                  line-height: 1.5;
                "><span style="color: #0ea5e9; font-size: 20px; margin-right: 8px;">ℹ️</span>Utiliza esta contraseña para iniciar sesión en tu cuenta.</p>
                
                <p style="
                  font-size: 16px;
                  color: #64748b;
                  margin: 0;
                  line-height: 1.6;
                  margin-left: 28px;
                ">Por seguridad, te recomendamos cambiar esta contraseña temporal después de iniciar sesión desde tu perfil de usuario.</p>
              </div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 40px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="
                          background: linear-gradient(135deg, #0ea5e9, #0284c7);
                          border-radius: 12px;
                          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
                        ">
                          <a href="https://full-reservas-web.vercel.app/auth/login" style="
                            display: inline-block;
                            color: white;
                            text-decoration: none;
                            padding: 18px 40px;
                            font-size: 18px;
                            font-weight: 700;
                            text-align: center;
                            letter-spacing: 0.5px;
                            border: none;
                          ">
                            <span style="margin-right: 8px;">🚀</span>Iniciar Sesión
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <div style="
                margin-top: 40px;
                padding: 28px 24px;
                background: linear-gradient(135deg, #fef2f2, #fee2e2);
                border-radius: 12px;
                border-left: 6px solid #ef4444;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
              ">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="width: 40px; vertical-align: top; padding-right: 16px;">
                      <div style="
                        width: 32px;
                        height: 32px;
                        background: #ef4444;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 32px;
                      ">
                        <span style="color: white; font-size: 18px;">⚠️</span>
                      </div>
                    </td>
                    <td style="vertical-align: top; text-align: left;">
                      <p style="
                        font-size: 16px;
                        color: #b91c1c;
                        margin: 0 0 8px 0;
                        line-height: 1.5;
                        font-weight: 700;
                      ">
                        <strong>Aviso de seguridad:</strong>
                      </p>
                      <p style="
                        font-size: 15px;
                        color: #dc2626;
                        margin: 0;
                        line-height: 1.6;
                      ">
                        Nunca compartas esta contraseña con nadie. Si no solicitaste este cambio, contacta inmediatamente con nuestro equipo de soporte.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Footer -->
              <div style="
                margin-top: 48px;
                padding-top: 32px;
                border-top: 2px solid #e2e8f0;
                position: relative;
              ">
                <div style="
                  position: absolute;
                  top: -1px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 60px;
                  height: 2px;
                  background: linear-gradient(135deg, #0ea5e9, #0284c7);
                "></div>
                <p style="
                  font-size: 14px;
                  color: #94a3b8;
                  margin: 0;
                  line-height: 1.6;
                "><span style="margin-right: 8px;">📬</span>Este es un email automático, por favor no respondas a este mensaje.<br>
                Si tienes alguna consulta, contacta con nuestro equipo de soporte.</p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}