const User = require("../models/user.model");
const Institution = require("../models/institution.model");
const { encrypt, compare  } = require("../utils/helpers/handle.password");
const { sendRecoveryCodeEmail } = require("../../config/mail.conf");
const { generateToken } = require("../utils/helpers/handle.jwt");

exports.login = async (req, res) => {
  try {
    // Obtener el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos
    const userSearch = await User.aggregate([
      {
        $lookup: {
          from: "people",
          localField: "person",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: "$person",
      },
      {
        $match: {
          "person.email": email,
        },
      },

      {
        $project: {
          "person.email": 1,
          "person.name": 1,
          "person.lastName": 1,
          status: 1,
          password: 1,
          role: 1,
          "person.institution": 1,
        },
      },
    ]);

    // Verificar si el usuario existe
    if (userSearch.length == 0) {
      return res.status(400).send({ error: "Usuario no encontrado" });
    }

    const user = userSearch[0];

    // Verificar si el usuario está activo
    if (!user.status) {
      return res.status(400).send({ error: "Usuario inactivo" });
    }
    // Verificar la validez de la contraseña
  
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Contraseña invalida" });
    }

    let nameInstitution = "";
    if (user.person.institution) {
      const institution = await Institution.findById(user.person.institution);
      nameInstitution = institution.nameInstitution;
    }

    // Preparar los datos de respuesta
    const response = {
      id: user._id,
      name: `${user.person.name} ${user.person.lastName}`,
      institution: nameInstitution,
      role: user.role,
    };
    // Generar un token de autenticación
    const token = generateToken(response);

    // Enviar la respuesta con el mensaje de éxito y el token
    res.status(200).send({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al iniciar sesión" });
  }
};

//Método para recuperar contraseña
exports.recoverPassword = async (req, res) => {
  try {
    // Obtener el email del cuerpo de la solicitud
    const { email } = req.body;

    // Buscar el usuario en la base de datos
    const userSearch = await User.aggregate([
      {
        $lookup: {
          from: "people",
          localField: "person",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: "$person",
      },
      {
        $match: {
          "person.email": email,
        },
      },
    ]);

    // Verificar si el usuario existe
    if (userSearch.length == 0) {
      return res.status(400).send({ error: "Correo no encontrado" });
    }

     // Obtener el usuario por su ID
    const user = await User.findById(userSearch[0]._id);

    // Generar un código de recuperación aleatorio de 6 dígitos
    const recoverCode = Math.floor(100000 + Math.random() * 900000);

    // Establecer el código de recuperación y su fecha de expiración
    user.recoverCode = recoverCode;
    user.recoverCodeExp = Date.now() + 300000; // 300000 milisegundos = 5 minutos

    

    // Guardar los cambios en el usuario
    await user.save();

    const subject = 'SeriusGame - Recuperación de cuenta'
    const operation = 1;
    // Enviar el correo electrónico con el código de recuperación
    sendRecoveryCodeEmail(email, recoverCode, subject, operation).then((result) => {
      if (result === true) {
        res.status(200).send({
          message: "Código de recuperación enviado",
          timeExpire: user.recoverCodeExp.toLocaleString(),
          seconds: Math.floor(user.recoverCodeExp - Date.now()),
        });
      } else {
        res.status(403).send({
          error: "Servicio no disponible, inténtelo más tarde",
        });
      }
    });

    
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: "Error en la recuperación de contraseña" });
  }
};

//Metodo recibe el email y el codigo de recuperacion y los valida
exports.validateRecoverCode = async (req, res) => {
  console.log(req.body);
  try {
    const { code, email } = req.body;

    const userSearch = await User.aggregate([
      {
        $lookup: {
          from: "people",
          localField: "person",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: "$person",
      },
      {
        $match: {
          "person.email": email,
        },
      },
    ]);

    if (userSearch.length == 0) {
      return res.status(400).send({ error: "Correo no encontrado" });
    }

    const user = await User.findById(userSearch[0]._id);
    if (user.recoverCode != code) {
      return res.status(400).send({ error: "Código invalido" });
    }

    if (user.recoverCodeExp < Date.now()) {
      // Código expirado, limpiar el código de recuperación y su fecha de expiración
      user.recoverCode = null;
      user.recoverCodeExp = null;
      await user.save();
      return res.status(400).send({ error: "Su código ha expirado" });
    }

    await user.save();

    res.status(200).send({ message: "Código valido" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al comprobar código");
  }
};

//metodo para cambiar la contraseña de un usuario
exports.changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const userSearch = await User.aggregate([
      {
        $lookup: {
          from: "people",
          localField: "person",
          foreignField: "_id",
          as: "person",
        },
      },
      {
        $unwind: "$person",
      },
      {
        $match: {
          "person.email": email,
        },
      },
    ]);

    if (userSearch.length == 0) {
      console.log("Correo no encontrado")
      return res.status(400).send({ error: "Correo no encontrado" });
    }

    if (userSearch[0].recoverCodeExp < Date.now()) {
      console.log("Código expirado")
       // Código validado correctamente, eliminar el código de recuperación y su fecha de expiración
    user.recoverCode = null;
    user.recoverCodeExp = null;
      return res.status(400).send({ error: "Código expirado" });
    }

    const newPass = await encrypt(newPassword);

    const user = await User.findById(userSearch[0]._id);
    user.password = newPass;
     // Código validado correctamente, eliminar el código de recuperación y su fecha de expiración
    user.recoverCode = null;
    user.recoverCodeExp = null;
    await user.save();
    res.status(200).send({ message: "Contraseña cambiada con éxito" });
  } catch (error) {
    console.log(error)
    res.status(400).send(error + "Error al cambiar contraseña");
  }
};

