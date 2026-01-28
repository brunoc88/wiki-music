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
