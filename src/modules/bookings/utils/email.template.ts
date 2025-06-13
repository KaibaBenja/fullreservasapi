interface data {
  code: string;
  date: string;
  place: string;
}

export function generateHtml(data: data) {
  const { code, date, place } = data;
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reserva Confirmada</title>
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
              
              <!-- Success icon -->
              <div style="margin-bottom: 24px;">
                <div style="
                  width: 80px;
                  height: 80px;
                  background: #10b981;
                  border-radius: 50%;
                  display: inline-block;
                  position: relative;
                  vertical-align: middle;
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                  ">
                    <path d="m9 12 2 2 4-4"></path>
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
              ">¡Reserva Confirmada!</h1>
              
              <!-- Description -->
              <p style="
                font-size: 16px;
                color: #6b7280;
                margin: 0 0 32px 0;
                line-height: 1.5;
              ">Tu reserva en <strong style="color: #374151;">${place}</strong> ha sido confirmada exitosamente.</p>

              <!-- Reservation details card -->
              <div style="
                background: #eff6ff;
                padding: 32px 24px;
                border-radius: 12px;
                margin-bottom: 32px;
                border: 1px solid #dbeafe;
              ">
                <!-- Reservation code header -->
                <div style="margin-bottom: 16px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
                    <path d="M13 5v2"></path>
                    <path d="M13 17v2"></path>
                    <path d="M13 11v2"></path>
                  </svg>
                  <span style="
                    font-weight: 600;
                    color: #1e40af;
                    font-size: 16px;
                    vertical-align: middle;
                  ">Código de Reserva</span>
                </div>
                
                <!-- Reservation code -->
                <div style="
                  font-size: 48px;
                  font-weight: 800;
                  color: #1e40af;
                  margin-bottom: 20px;
                  letter-spacing: 0.1em;
                  font-family: 'Courier New', monospace;
                ">${code}</div>
                
                <!-- Date and time -->
                <div style="margin-top: 16px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="vertical-align: middle; margin-right: 8px;">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span style="
                    color: #1e40af;
                    font-weight: 600;
                    font-size: 16px;
                    vertical-align: middle;
                  ">${date}</span>
                </div>
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
                ">Preséntate al comercio a la hora de tu reserva y muestra este código.</p>
                
                <p style="
                  font-size: 14px;
                  color: #6b7280;
                  margin: 0;
                  line-height: 1.5;
                ">Puedes consultar tu código de reserva en cualquier momento desde:<br><strong style="color: #374151;">Mi Perfil > Mis Reservas</strong></p>
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
                    ">Ir a Mis Reservas</a>
                  </td>
                </tr>
              </table>

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

