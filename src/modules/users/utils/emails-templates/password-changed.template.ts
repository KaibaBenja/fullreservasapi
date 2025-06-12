export function htmlPasswordChanged() {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Contraseña actualizada</h2>
        <p style="color: #555;">
          Te informamos que tu contraseña fue cambiada exitosamente. Si realizaste este cambio, no necesitás hacer nada más.
        </p>
        <p style="color: #555;">
          Si no fuiste vos, te recomendamos restablecer tu contraseña inmediatamente y ponerte en contacto con nuestro soporte.
        </p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://tusitio.com/recuperar" style="background-color: #e53935; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #999; font-size: 14px; margin-top: 20px;">
          Este mensaje es automático. Si no reconocés esta acción, respondé a este correo o contactanos lo antes posible.
        </p>
      </div>
    </div>
  `;
}
