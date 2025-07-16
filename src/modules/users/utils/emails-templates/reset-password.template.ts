export const htmlResetPassword = (
  url: string,
  userEmail: string,
  expirationTime = "15 minutos"
) => {
  return `
  <!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperación de Contraseña</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-height: 100vh;">
    <tr>
      <td align="center" valign="top" style="padding: 40px 20px;">

        <table cellpadding="0" cellspacing="0" border="0" style="
          max-width: 600px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(3, 105, 161, 0.1);
          overflow: hidden;
        ">

          <tr>
            <td style="
              background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
              padding: 40px 40px 60px 40px;
              text-align: center;
              position: relative;
            ">
              <!-- Logo en lugar de ícono -->
              <div style="
                  width: 100%;
                  height: 100%;
                  margin-bottom: 24px;
                  /* background: white;
                  border-radius: 50%; */
                  overflow: hidden;
                  margin: 12px auto;
                  display: flex;
                  items: center;
                  justify-content: center;
                    /* box-shadow: 0 0 10px rgba(0,0,0,0.1); */
                  ">
                    <!-- Aquí va tu logo -->
                    <img src="https://full-reservas-web.vercel.app/ico/logo_blanco.png" alt="Full Reservas" style="
                        width: 80%;
                        height: 80%;
                        object-fit: contain;
                        display: block;
                    ">
              </div>


              <h1 style="
                color: white;
                font-size: 32px;
                font-weight: 700;
                margin: 0 0 12px 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              ">Recuperación de Contraseña</h1>

              <p style="
                color: rgba(255, 255, 255, 0.9);
                font-size: 18px;
                margin: 0;
                font-weight: 400;
              ">Restablece tu acceso de forma segura</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 40px 40px 40px;">

              <div style="
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border: 2px solid #0369a1;
                border-radius: 16px;
                padding: 32px;
                padding-bottom: 10px;
                text-align: center;
                margin: 32px 0 32px 0;
                position: relative;
                box-shadow: 0 8px 25px rgba(3, 105, 161, 0.15);
              ">
                <div style="
                  background: white;
                  border-radius: 12px;
                  padding: 24px;
                  margin-bottom: 10px;
                  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.1);
                ">
                  <p style="
                    color: #0369a1;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0 0 12px 0;
                  "><span style="margin-right: 8px;">📧</span>Solicitud Recibida</p>

                  <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: #075985;
                    margin: 0;
                  ">Hemos recibido tu solicitud de restablecimiento</div>
                </div>

                <p style="
                  color: #0369a1;
                  font-size: 14px;
                  margin: 0;
                  font-weight: 500;
                ">Para la cuenta: <strong>${userEmail}</strong></p>
              </div>

              <div style="margin-bottom: 32px;">
                <h2 style="
                  color: #075985;
                  font-size: 20px;
                  font-weight: 600;
                  margin: 0 0 20px 0;
                  text-align: center;
                ">¿Cómo continuar?</h2>

                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                  <tr>
                    <td style="
                      padding: 20px;
                      background: #f8fafc;
                      border-radius: 12px;
                      border-left: 4px solid #0369a1;
                    ">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 60px;">
                            <div style="
                              width: 44px;
                              height: 44px;
                              background: #0369a1;
                              border-radius: 50%;
                              text-align: center;
                              line-height: 44px;
                              color: white;
                              font-weight: bold;
                              font-size: 18px;
                            ">1</div>
                          </td>
                          <td>
                            <p style="
                              color: #1e293b;
                              font-size: 16px;
                              font-weight: 600;
                              margin: 0 0 8px 0;
                            ">Haz clic en el botón de abajo</p>
                            <p style="
                              color: #64748b;
                              font-size: 14px;
                              margin: 0;
                              line-height: 1.5;
                            ">Te redirigiremos nuevamente a Fullreservas, donde podrás crear tu nueva contraseña.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="
                      padding: 20px;
                      background: #f8fafc;
                      border-radius: 12px;
                      border-left: 4px solid #0369a1;
                    ">
                      <table cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="width: 60px;">
                            <div style="
                              width: 44px;
                              height: 44px;
                              background: #0369a1;
                              border-radius: 50%;
                              text-align: center;
                              line-height: 44px;
                              color: white;
                              font-weight: bold;
                              font-size: 18px;
                            ">2</div>
                          </td>
                          <td>
                            <p style="
                              color: #1e293b;
                              font-size: 16px;
                              font-weight: 600;
                              margin: 0 0 8px 0;
                            ">Crea tu nueva contraseña</p>
                            <p style="
                              color: #64748b;
                              font-size: 14px;
                              margin: 0;
                              line-height: 1.5;
                            ">Elige una contraseña segura que contenga al menos 8 caracteres, incluyendo letras,
                              números y símbolos.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Security notice -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px; margin-top: 20px">
                    <tr>
                      <td style="
                        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                        border: 1px solid #f59e0b;
                        border-radius: 12px;
                        padding: 24px;
                      ">
                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                              <span style="
                                color: #d97706;
                                font-size: 32px;
                                line-height: 1;
                              ">⏰</span>
                            </td>
                            <td style="vertical-align: top; text-align: left;">
                              <p style="
                                color: #92400e;
                                font-weight: 600;
                                margin: 0 0 8px 0;
                                font-size: 16px;
                              ">Tiempo Limitado</p>
                              <p style="
                                color: #a16207;
                                margin: 0;
                                font-size: 15px;
                                line-height: 1.6;
                              ">
                                Este enlace expirará en <strong>${expirationTime}</strong>. Si no lo usas dentro de este tiempo, deberás solicitar un nuevo restablecimiento.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
              </div>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                <tr>
                  <td align="center">
                    <a href="${url}" style="
                      display: inline-block;
                      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
                      color: white;
                      text-decoration: none;
                      border-radius: 8px;
                      padding: 16px 32px;
                      font-size: 18px;
                      font-weight: 700;
                      box-shadow: 0 8px 20px rgba(3, 105, 161, 0.3);
                    ">
                      🔒 Restablecer Mi Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <div style="
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 32px;
                text-align: center;
              ">
                <h3 style="
                  color: #475569;
                  font-size: 16px;
                  font-weight: 600;
                  margin: 0 0 12px 0;
                ">🔗 ¿El botón no funciona?</h3>
                <p style="
                  color: #64748b;
                  font-size: 14px;
                  margin: 0 0 16px 0;
                ">Copia y pega este enlace en tu navegador:</p>
                <div style="
                  background: white;
                  border: 2px dashed #cbd5e1;
                  border-radius: 8px;
                  padding: 16px;
                  word-break: break-all;
                  font-family: 'Courier New', monospace;
                  color: #0369a1;
                  font-size: 13px;
                ">
                  ${url}
                </div>
              </div>

            </td>
          </tr>

          <tr>
            <td style="
              background: #f8fafc;
              padding: 24px 40px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            ">
              <p style="
                color: #64748b;
                font-size: 12px;
                margin: 0 0 8px 0;
              ">🔐 Este es un correo electrónico de seguridad. Si tienes dudas, contacta con nuestro soporte.<br>
                Fullreservas nunca te pedirá tu contraseña por correo electrónico.</p>
              <p style="
                color: #94a3b8;
                font-size: 11px;
                margin: 0;
              ">Para soporte: soporte@fullreservas.com.ar</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>

</html>
  `;
};
