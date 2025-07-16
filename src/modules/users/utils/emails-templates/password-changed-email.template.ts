export function htmlPasswordChanged(mail: string, changeTime: string) {
    return `
  <!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contraseña Actualizada</title>
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
              ">Contraseña Actualizada</h1>

                            <p style="
                color: rgba(255, 255, 255, 0.9);
                font-size: 18px;
                margin: 0;
                font-weight: 400;
              ">Tu cuenta está segura</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <div style="
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border: 2px solid #22c55e;
                border-radius: 16px;
                padding: 32px;
                text-align: center;
                margin: 30px 0 32px 0;
                position: relative;
                box-shadow: 0 8px 25px rgba(34, 197, 94, 0.15);
              ">
                                <div style="
                  background: white;
                  border-radius: 12px;
                  padding: 24px;
                  margin-bottom: 2px;
                  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
                ">
                                    <p style="
                    color: #16a34a;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0 0 12px 0;
                  "><span style="margin-right: 8px;">✅</span>Cambio Exitoso</p>
                                    <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: #15803d;
                    margin: 0;
                  ">Tu contraseña fue actualizada correctamente</div>
                                </div>
                            </div>

                            <div style="margin-bottom: 32px;">
                                <h2 style="
                  color: #075985;
                  font-size: 20px;
                  font-weight: 600;
                  margin: 0 0 20px 0;
                  text-align: center;
                ">Detalles de la Cuenta</h2>

                                <table cellpadding="0" cellspacing="0" border="0" width="100%"
                                    style="margin-bottom: 12px;">
                                    <tr>
                                        <td style="
                      padding: 16px 20px;
                      background: #f8fafc;
                      border-radius: 12px;
                      border-left: 4px solid #0369a1;
                    ">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 56px; vertical-align: top;">
                                                        <div style="
                              width: 40px;
                              height: 40px;
                              background: #0369a1;
                              border-radius: 10px;
                              text-align: center;
                              line-height: 40px;
                            ">
                                                            <span style="color: white; font-size: 20px;">📧</span>
                                                        </div>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <p style="
                              color: #64748b;
                              font-size: 12px;
                              font-weight: 500;
                              margin: 0 0 4px 0;
                              text-transform: uppercase;
                              letter-spacing: 0.5px;
                            ">Cuenta de Usuario</p>
                                                        <p style="
                              color: #1e293b;
                              font-size: 16px;
                              font-weight: 600;
                              margin: 0;
                            ">${mail}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="
                      padding: 16px 20px;
                      background: #f8fafc;
                      border-radius: 12px;
                      border-left: 4px solid #0369a1;
                    ">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="width: 56px; vertical-align: top;">
                                                        <div style="
                              width: 40px;
                              height: 40px;
                              background: #0369a1;
                              border-radius: 10px;
                              text-align: center;
                              line-height: 40px;
                            ">
                                                            <span style="color: white; font-size: 20px;">🕐</span>
                                                        </div>
                                                    </td>
                                                    <td style="vertical-align: top;">
                                                        <p style="
                              color: #64748b;
                              font-size: 12px;
                              font-weight: 500;
                              margin: 0 0 4px 0;
                              text-transform: uppercase;
                              letter-spacing: 0.5px;
                            ">Fecha y Hora del Cambio</p>
                                                        <p style="
                              color: #1e293b;
                              font-size: 16px;
                              font-weight: 600;
                              margin: 0;
                            ">${changeTime}</p>
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
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="
                          background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
                          border-radius: 12px;
                          box-shadow: 0 8px 20px rgba(3, 105, 161, 0.3);
                        ">
                                                    <a href="https://full-reservas-web.vercel.app/perfil?section_active=perfil"
                                                        style="
                            display: inline-block;
                            color: white;
                            text-decoration: none;
                            padding: 16px 32px;
                            font-size: 16px;
                            font-weight: 600;
                            text-align: center;
                          ">
                                                        <span style="margin-right: 8px;">👤</span>Ir a Mi Cuenta
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                                <tr>
                                    <td style="
                    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    padding: 24px;
                  ">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <span style="
                            color: #dc2626;
                            font-size: 32px;
                            line-height: 1;
                          ">🚨</span>
                                                </td>
                                                <td style="vertical-align: top; text-align: left;">
                                                    <p style="
                            color: #b91c1c;
                            font-weight: 700;
                            margin: 0 0 8px 0;
                            font-size: 16px;
                          ">¿No fuiste vos?</p>
                                                    <p style="
                            color: #dc2626;
                            margin: 0 0 16px 0;
                            font-size: 15px;
                            line-height: 1.6;
                          ">
                                                        Si no realizaste este cambio, tu cuenta podría estar
                                                        comprometida. Actuá inmediatamente para proteger tu información.
                                                    </p>

                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="
                                background: #dc2626;
                                border-radius: 8px;
                                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                              ">
                                                                <a href="https://full-reservas-web.vercel.app/auth/forgot-password"
                                                                    style="
                                  display: inline-block;
                                  color: white;
                                  text-decoration: none;
                                  padding: 12px 24px;
                                  font-size: 14px;
                                  font-weight: 600;
                                  text-align: center;
                                ">
                                                                    <span
                                                                        style="margin-right: 8px;">🔒</span>Restablecer
                                                                    Contraseña Ahora
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

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
                line-height: 1.4;
              "><span style="margin-right: 8px;">🔐</span>Este es un correo electrónico de seguridad. Si tienes dudas,
                                contacta con nuestro soporte.<br>
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
}
