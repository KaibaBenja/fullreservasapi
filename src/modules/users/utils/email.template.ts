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
      background-color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    ">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
          <td>
            <!-- Main container -->
            <div style="
              background: white;
              padding: 40px 32px;
              border-radius: 16px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              text-align: center;
            ">
              
              <!-- Lock icon -->
              <div style="margin-bottom: 24px;">
                <div style="
                  width: 80px;
                  height: 80px;
                  background: #3b82f6;
                  border-radius: 50%;
                  display: inline-block;
                  position: relative;
                  vertical-align: middle;
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  ">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Title -->
              <h1 style="
                font-size: 28px;
                font-weight: 700;
                color: #1e40af;
                margin: 0 0 16px 0;
                line-height: 1.2;
              ">Contraseña Restablecida</h1>
              
              <!-- Description -->
              <p style="
                font-size: 16px;
                color: #6b7280;
                margin: 0 0 32px 0;
                line-height: 1.5;
              ">Tu contraseña ha sido restablecida exitosamente. Utiliza la siguiente contraseña temporal para acceder a tu cuenta.</p>

              <!-- Password details card -->
              <div style="
                background: #eff6ff;
                padding: 32px 24px;
                border-radius: 12px;
                margin-bottom: 32px;
                border: 1px solid #dbeafe;
              ">
                <!-- Password header -->
                <div style="margin-bottom: 16px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                  </svg>
                  <span style="
                    font-weight: 600;
                    color: #1e40af;
                    font-size: 16px;
                    vertical-align: middle;
                  ">Tu Nueva Contraseña</span>
                </div>
                
                <!-- Password code -->
                <div style="
                  font-size: 36px;
                  font-weight: 800;
                  color: #1e40af;
                  margin-bottom: 20px;
                  letter-spacing: 0.1em;
                  font-family: 'Courier New', monospace;
                  background: #dbeafe;
                  padding: 16px 20px;
                  border-radius: 8px;
                  display: inline-block;
                  border: 2px solid #bfdbfe;
                ">${password}</div>
              </div>

              <!-- Instructions -->
              <div style="
                background: #f8fafc;
                padding: 24px;
                border-radius: 8px;
                margin-bottom: 24px;
                border-left: 4px solid #1e40af;
              ">
                <p style="
                  font-weight: 600;
                  margin: 0 0 12px 0;
                  color: #374151;
                  font-size: 16px;
                  line-height: 1.5;
                ">Utiliza esta contraseña para iniciar sesión en tu cuenta.</p>
                
                <p style="
                  font-size: 14px;
                  color: #6b7280;
                  margin: 0;
                  line-height: 1.5;
                ">Por seguridad, te recomendamos cambiar esta contraseña temporal después de iniciar sesión desde tu perfil de usuario.</p>
              </div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="#" style="
                      display: inline-block;
                      background: #1e40af;
                      color: white;
                      text-decoration: none;
                      border-radius: 8px;
                      padding: 16px 32px;
                      font-size: 16px;
                      font-weight: 600;
                      min-width: 200px;
                      text-align: center;
                    ">Iniciar Sesión</a>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <div style="
                margin-top: 32px;
                padding: 20px;
                background-color: #fee2e2;
                border-radius: 8px;
                border-left: 4px solid #ef4444;
              ">
                <div style="display: flex; align-items: flex-start; text-align: left;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <div>
                    <p style="
                      font-size: 14px;
                      color: #b91c1c;
                      margin: 0;
                      line-height: 1.5;
                      font-weight: 600;
                    ">
                      <strong>Aviso de seguridad:</strong>
                    </p>
                    <p style="
                      font-size: 14px;
                      color: #b91c1c;
                      margin: 4px 0 0 0;
                      line-height: 1.5;
                    ">
                      Nunca compartas esta contraseña con nadie. Si no solicitaste este cambio, contacta inmediatamente con nuestro equipo de soporte.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div style="
                margin-top: 40px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
              ">
                <p style="
                  font-size: 12px;
                  color: #9ca3af;
                  margin: 0;
                  line-height: 1.4;
                ">Este es un email automático, por favor no respondas a este mensaje.<br>
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
