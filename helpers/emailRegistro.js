import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
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
        subject:"Comprueba tu cuenta",
        text: "Comprueba tu cuenta",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta aqui:
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
               </p>` 
      });
      console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRegistro
