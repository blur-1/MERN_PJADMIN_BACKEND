import nodemailer from 'nodemailer'

const emailForgotPassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      const {email, nombre, token}= datos;

      //enviar los datos al email
      const info = await transport.sendMail({
        from: "Desde la web proj Adm veterinaria",
        to: email,
        subject:"Restablece tu password",
        text: "Restablece tu password",
        html: `<p>Hola: ${nombre}, reestablece tu password:
                <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reestablecer aqui</a>
               </p>` 
      });
      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailForgotPassword
