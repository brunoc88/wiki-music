# Mail Service – Password Recovery

Este módulo se encarga de enviar el email de recuperación de contraseña al usuario utilizando **Nodemailer**.

## Responsabilidad
- Construir el link de recuperación con el token
- Configurar el transporter SMTP
- Enviar el correo con el enlace seguro

## Código

```ts
import nodemailer from "nodemailer"

export const mailService = {
  sendPasswordRecovery(email: string, token: string) {
    const link = `${process.env.FRONT_URL}/recover-password?token=${token}`

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    return transporter.sendMail({
      from: '"Soporte" <no-reply@app.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hacé click para recuperar tu contraseña:</p>
        <a href="${link}">${link}</a>
      `
    })
  }
}
```

## Variables de entorno requeridas

```env
FRONT_URL=http://localhost:3000
MAIL_USER=tu_mail@gmail.com
MAIL_PASS=tu_password_o_app_password
```

## Notas de seguridad
- El token **nunca** se devuelve al frontend por la API.
- El token solo viaja dentro del link enviado por email.
- El token tiene expiración y uso único (invalidado luego del reset).

## Manejo de errores
- Los errores de envío son propagados al service llamador.
- El controller decide la respuesta HTTP final.

Este diseño mantiene separadas las responsabilidades y sigue un flujo real de producción.
