import nodemailer from 'nodemailer'

// Configurar el transporte SMTP para Gmail
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD
  }
});


export const sendEmail = (email, subject, text) => {
  // Configurar el correo electrónico
  let mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject,
    text
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado exitosamente:', info.response);
    }
  });

}