interface Data {
    code: string;
    date: string;
    place: string;
    googleCalendarUrl: string;
    hour?: string;
}

export const bookingMail = ({ code, date, place, googleCalendarUrl, hour }: Data): string => {
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
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-height: 100vh;
">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <tr>
            <td>
                <!-- Header with gradient -->
                <div style="
                    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                    padding: 32px;
                    border-radius: 16px 16px 0 0;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                ">

                    <!-- Contenedor del icono/logo -->
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
                        font-size: 32px;
                        font-weight: 800;
                        color: white;
                        margin: 0;
                        line-height: 1.2;
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        position: relative;
                        z-index: 1;
                    ">¡Reserva Confirmada!</h1>
                </div>

                <!-- Main content -->
                <div style="
                    background: white;
                    padding: 40px 32px;
                    border-radius: 0 0 16px 16px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    position: relative;
                ">
                    <p style="
                        font-size: 18px;
                        color: #64748b;
                        margin: 0 0 12px 0;
                        line-height: 1.6;
                        text-align: center;
                    ">Tu reserva en <strong style="color: #0369a1;">${place}</strong> ha sido confirmada
                        exitosamente.</p>

                    <!-- Date and time -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="
                            display: inline-flex;
                            align-items: center;
                            background: white;
                            padding: 12px 20px;
                            border-radius: 25px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            border: 1px solid #e2e8f0;
                        ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" style="margin-right: 10px;">
                                <path d="M8 2v4"></path>
                                <path d="M16 2v4"></path>
                                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                <path d="M3 10h18"></path>
                            </svg>
                            <span style="
                                color: #0284c7;
                                font-weight: 700;
                                font-size: 16px;
                            ">${date}${hour ? ` - ${hour}` : ""}</span>
                        </div>
                    </div>

                    <!-- Reservation details card -->
                    <div style="
                        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                        padding: 32px 24px;
                        border-radius: 16px;
                        margin-bottom: 32px;
                        border: 2px solid #bae6fd;
                        position: relative;
                        overflow: hidden;
                    ">
                        <!-- Reservation code header -->
                        <div style="margin-bottom: 20px; text-align: center;">
                            <div style="
                                display: inline-flex;
                                align-items: center;
                                background: rgba(2, 132, 199, 0.1);
                                padding: 8px 16px;
                                border-radius: 20px;
                                border: 1px solid rgba(2, 132, 199, 0.2);
                            ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" style="margin-right: 8px;">
                                    <path
                                        d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z">
                                    </path>
                                    <path d="M13 5v2"></path>
                                    <path d="M13 17v2"></path>
                                    <path d="M13 11v2"></path>
                                </svg>
                                <span style="
                                    font-weight: 600;
                                    color: #0284c7;
                                    font-size: 16px;
                                ">Código de Reserva</span>
                            </div>
                        </div>

                        <!-- Reservation code -->
                        <div style="
                            background: white;
                            padding: 24px;
                            border-radius: 12px;
                            margin-bottom: 24px;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            border: 1px solid #e2e8f0;
                        ">
                            <div style="
                                font-size: 48px;
                                font-weight: 900;
                                color: #0284c7;
                                text-align: center;
                                letter-spacing: 0.15em;
                                font-family: 'Courier New', monospace;
                                text-shadow: 0 2px 4px rgba(2, 132, 199, 0.1);
                            ">${code}</div>
                        </div>

                        <p style="
                            font-size: 14px;
                            color: #64748b;
                            font-weight: 600;
                            text-align: center;
                        ">
                            Copia este código manualmente para presentarlo en el comercio.
                        </p>
                    </div>

                    <!-- Instructions -->
                    <div style="
                        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                        padding: 24px;
                        border-radius: 12px;
                        margin-bottom: 32px;
                        border-left: 4px solid #0284c7;
                        position: relative;
                    ">

                        <p style="
                            font-weight: 600;
                            margin: 0 0 12px 0;
                            color: #334155;
                            font-size: 16px;
                            line-height: 1.5;
                        ">📍 Preséntate al comercio a la hour de tu reserva y muestra este código.</p>

                        <p style="
                            font-size: 14px;
                            color: #64748b;
                            margin: 0;
                            line-height: 1.6;
                            gap: 1rem;
                            text-align: start;
                        ">
                            💡 Puedes consultar tu código de reserva en cualquier momento en la web:
                        </p>
                        <p style="color: #0369a1; text-align: center; width: 100%;">
                            <strong>Mi Perfil > Mis Reservas</strong>
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                        <tr>
                            <td align="center">
                                <a href="#" style="
                                    display: inline-block;
                                    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 12px;
                                    padding: 16px 32px;
                                    font-size: 16px;
                                    font-weight: 600;
                                    min-width: 200px;
                                    text-align: center;
                                    box-shadow: 0 4px 14px 0 rgba(2, 132, 199, 0.3);
                                    transition: all 0.2s ease;
                                    border: 2px solid transparent;
                                ">
                                    Ir a Mis Reservas
                                </a>
                            </td>
                        </tr>
                    </table>

                    <!-- Botón Agregar a Google Calendar -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 32px;">
                        <tr>
                            <td align="center">
                                <a href="${googleCalendarUrl}"
                                    style="
                                        display: inline-block;
                                        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                                        min-width: 200px;
                                        color: white;
                                        text-decoration: none;
                                        padding: 14px 28px;
                                        border-radius: 12px;
                                        font-weight: 600;
                                        font-size: 16px;
                                        box-shadow: 0 8px 20px rgba(39, 151, 202, 0.3);
                                    ">
                                    <div style="display: flex; gap: 1rem;">
                                        <img src="https://full-reservas-web.vercel.app/img/Google.png" alt="Full Reservas" style="
                                            width: 24px;
                                            height: 24px;
                                            object-fit: contain;
                                            margin-right: 8px;
                                            display: block;
                                        ">
                                        <span>
                                            Agregar en el Calendar
                                        </span>
                                    </div>
                                </a>
                            </td>
                        </tr>
                    </table>

                    <!-- Footer -->
                    <div style="
                        margin-top: 40px;
                        padding-top: 24px;
                        border-top: 2px solid #f1f5f9;
                        text-align: center;
                    ">
                        <div style="
                            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                            padding: 16px;
                            border-radius: 8px;
                            border: 1px solid #e2e8f0;
                        ">
                            <p style="
                                font-size: 12px;
                                color: #64748b;
                                margin: 0;
                                line-height: 1.5;
                            ">
                                🤖 Este es un email automático, por favor no respondas a este mensaje.<br>
                                📞 Si tienes alguna consulta, contacta con nuestro equipo de soporte.
                            </p>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>
  `;
};
