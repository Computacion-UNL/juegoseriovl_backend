const nodemailer = require('nodemailer');

async function sendRecoveryCodeEmail(email, data, subject, operation) {
    try {
        let transporter = null; 
        try {
             transporter = nodemailer.createTransport({
              host: process.env.MAIL_HOST,
              port: process.env.MAIL_PORT,
              secure: true,
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
              }
            });
          
            console.log('Connected to email server');
          } catch (error) {
            console.log('Failed to connect to email server:', error);
          }

        if (transporter==null) {
            console.log('No se pudo conectar al servidor de correo');
            return false;
        }

        if(operation===0){
          await transporter.sendMail({
            from: `"SeriusGame" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
                  <h2 style="text-align: center; color: #333333;">Bienvenido(a) a SeriusGame</h2>
                  <p style="text-align: center; color: #666666;">Estimado(a) usuario(a),</p>
                  <p style="text-align: center; color: #666666;">Le damos la bienvenida a SeriusGame. Su cuenta ha sido creada satisfactoriamente.</p>
                  <p style="text-align: center; color: #666666;">A continuación, encontrará los detalles de su cuenta:</p>
                  <ul style="list-style-type: none; padding: 0; text-align: center;">
                    <li><strong>Usuario:</strong> ${email}</li>
                    <li><strong>Contraseña de acceso:</strong> ${data}</li>
                  </ul>
                  <p style="text-align: center; color: #666666;">Recuerde mantener su contraseña segura y no compartirla con nadie.</p>
                  <p style="text-align: center; color: #666666;">Gracias por unirse a SeriusGame.</p>
                  <p style="text-align: center; color: #666666;">El equipo de SeriusGame</p>
                </div>
              </div>
            `,
          });
        }

        if(operation===1){
          await transporter.sendMail({
            from: `"SeriusGame" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
                  <h2 style="text-align: center; color: #333333;">Recuperación de contraseña</h2>
                  <p style="text-align: center; color: #666666;">Estimado(a) usuario(a),</p>
                  <p style="text-align: center; color: #666666;">Hemos recibido una solicitud de recuperación de contraseña para su cuenta.</p>
                  <p style="text-align: center; color: #666666;">A continuación, encontrará el código de recuperación:</p>
                  <div style="text-align: center; background-color: #ebebeb; padding: 10px; border-radius: 5px;">
                    <h3 style="color: #333333; margin: 0;">${data}</h3>
                  </div>
                  <p style="text-align: center; color: #666666;">Ingrese este código en el formulario de recuperación de contraseña.</p>
                  <p style="text-align: center; color: #666666;">Si no solicitó este código de recuperación, puede ignorar este correo electrónico.</p>
                  <p style="text-align: center; color: #666666;">Gracias,</p>
                  <p style="text-align: center; color: #666666;">El equipo de SeriusGame</p>
                </div>
              </div>
            `,
          });
        }

        if(operation===3){
          await transporter.sendMail({
            from: `"SeriusGame" <${process.env.MAIL_USER}>`,
            to: email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <div style="background-color: #ffffff; border-radius: 10px; padding: 20px;">
                  <h2 style="text-align: center; color: #333333;">Bienvenido(a) a SeriusGame</h2>
                  <p style="text-align: center; color: #666666;">Estimado(a) usuario(a),</p>
                  <p style="text-align: center; color: #666666;">Le saludamos desde el soporte de SeriusGame. Su solicitud de renovación se ha realizado satisfactoriamente.</p>
                  <p style="text-align: center; color: #666666;">A continuación, encontrará los detalles de  acceso a su cuenta:</p>
                  <ul style="list-style-type: none; padding: 0; text-align: center;">
                    <li><strong>Usuario:</strong> ${email}</li>
                    <li><strong>Contraseña de acceso:</strong> ${data}</li>
                  </ul>
                  <p style="text-align: center; color: #666666;">Recuerde mantener su contraseña segura y no compartirla con nadie.</p>
                  <p style="text-align: center; color: #666666;">Gracias por contactarse con SeriusGame.</p>
                  <p style="text-align: center; color: #666666;">El equipo de SeriusGame</p>
                </div>
              </div>
            `,
          });
        }
       

        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { sendRecoveryCodeEmail };
