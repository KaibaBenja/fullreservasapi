export function htmlResetPassword(utl: string) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Recuperación de contraseña</h2>
        <p style="color: #555;">
          Hemos recibido una solicitud para restablecer tu contraseña. Si no hiciste esta solicitud, podés ignorar este correo.
        </p>
        <p style="color: #555;">
          Para continuar, hacé clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${utl}" style="background-color: #2196f3; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #999; font-size: 14px;">
          Si el botón no funciona, copiá y pegá este enlace en tu navegador:<br/>
          <a href="${utl}" style="color: #2196f3;">${utl}</a>
        </p>
      </div>
    </div>
  `;
}
