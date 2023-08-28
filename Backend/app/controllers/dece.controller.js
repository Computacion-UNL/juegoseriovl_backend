const mongoose = require("mongoose");

const Dece = require("../models/dece.model.js");
const Caso = require("../models/caso.model.js");
const Person = require("../models/person.model.js");
const User = require("../models/user.model.js");
const Institution = require("../models/institution.model.js");
const { encrypt } = require("../utils/helpers/handle.password");
const { logsAudit } = require('../utils/helpers/auditEvent.js');
const { sendRecoveryCodeEmail } = require("../../config/mail.conf");
const { validateIDCard, generatorPass } = require("../utils/helpers/tools.js");

// Create and Save a new dece
exports.createDece = async (req, res) => {
  console.log(req.body)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //Obtenemos la data
    const { CI, name, lastName, address, phone, email, nameInstitution } = req.body;

    //Verificamos la validez de la cédula
    const validateCard = await validateIDCard(CI)

    //Emitimos un error en caso de que la cédula sea erronea
    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula que ingresaste es inválida");
      return res.status(400).send({ error: "La cédula que ingresaste es inválida" });
    }

    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ CI }).session(session);
    const isEmailNotDuplicated = await Person.findOne({ email }).session(session);

    //si el email ya esta registrado retornamos un error
    if (isCINotDuplicated) {
      console.log("La cédula pertenece a un usuario registrado")
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "La cédula pertenece a un usuario registrado" });
    }

    if (isEmailNotDuplicated) {
      console.log("El correo pertenece a un usuario registrado")
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El correo pertenece a un usuario registrado" });
    }

    //Verifica la existencia de la institucion 
    const existingInstitution = await Institution.findOne({ nameInstitution }).session(session);
    //Emite un error si la institucion no existe
    if (!existingInstitution) {
      await session.abortTransaction();
      session.endSession();
      console.log("La institución no se encuentra registrada");
      return res.status(400).send({ error: "La institución no se encuentra registrada" });
    }

    //Genera una contraseña de Mayúsculas, minúsculas y números
    const pass = generatorPass();
    //Encripta la contraseña
    const hashedPassword = await encrypt(pass)
    //Guarda los datos para enviar el correo.
    const subject = 'SeriusGame - Nueva cuenta'
    const operation = 0;

    const newPerson = await Person.create({ CI, name, lastName, address, phone, email, institution: existingInstitution._id })
    const user = await User.create({ password: hashedPassword, person: newPerson._id, role: "DECE" })
    const dece = await Dece.create({ user: user._id })
    await logsAudit(req, 'CREATE', 'DECE', dece, Object.keys(req.body), "Registro DEDE");

    //Enviamos el correo  con los datos 
    const result = await sendRecoveryCodeEmail(email, pass, subject, operation)
    if (result) {
      console.log(`Código enviado exitosamente`);
    } else {
      console.log(`Error al enviar el código`);
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).send({ message: "Dece creado correctamente" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al crear el Dece" });
  }
};


// Retrieve and return all dece from the database.
exports.getDeces = async (req, res) => {
  try {
    const deces = await Dece.find().populate({
      path: "user",
      select: "-_id role status",
      populate: {
        path: "person",
        select: "-_id CI name lastName phone email institution",
        populate: {
          path: "institution",
          select: "-_id nameInstitution",
        },
      },
    });

    const listaDece = await Promise.all(
      deces.map(async (dece) => {
        const user = dece.user;
        const person = user?.person;
        const institution = person?.institution;
        return {
          id: dece._id,
          CI: person ? person.CI : "no asignado",
          name: person ? person.name : "no asignado",
          lastName: person ? person.lastName : "no asignado",
          phone: person ? person.phone : "no asignado",
          email: person ? person.email : "no asignado",
          nameInstitution: institution
            ? person.institution.nameInstitution
            : "no asignado",
          role: user ? user.role : "no asignado",
          status: user ? user.status : "no asignado",
        };
      })
    );

    res
      .status(200)
      .send({ message: "Datos obtenidos correctamente", data: listaDece });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al obtener los dece" });
  }
};

// Find a single dece with a id
exports.getDece = async (req, res) => {
  try {
    const { id } = req.params;
    const dece = await Dece.findById(id)
      .select("_id  user institution")
      .populate({
        path: "user",
        select: "-_id role status",
        populate: {
          path: "person",
          select: "-_id CI name lastName phone email address",
          populate: {
            path: "institution",
            select: "-_id nameInstitution",
          },
        },
      });

    if (!dece) {
      return res.status(400).send({ error: "Dece no encontrado" });
    }

    const deceData = {
      id: dece._id,
      CI: dece.user.person.CI,
      name: dece.user.person.name,
      lastName: dece.user.person.lastName,
      address: dece.user.person.address,
      phone: dece.user.person.phone,
      email: dece.user.person.email,
      nameInstitution: dece.user.person.institution.nameInstitution,
      role: dece.user.role,
      status: dece.user.status,
    };

    res.status(200).send({ message: "Dece encontrado!", data: deceData });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al obtener el dece" });
  }
};

// Update a dece identified by the id in the request
exports.updateDece = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Llega el id a editar
    const { id } = req.params;
    //datos para modificar
    const { CI, name, lastName, address, phone, email, nameInstitution } =
      req.body;

    //Busca la existencia del dece 
    const dece = await Dece.findById(id).session(session);
    //Busca la existencia del usuario
    const user = await User.findById(dece.user).session(session);
    //Busca la existencia de la persona
    const person = await Person.findById(user.person)
      .populate({
        path: "institution",
        select: "nameInstitution"
      })
      .session(session);

    if (!dece || !user || !person) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El dece no se encuentra registrado" });
    }

    //Verifica la validez de la cédula
    const validateCard = await validateIDCard(CI);

    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula que ingresaste es inválida");
      return res
        .status(400)
        .send({ error: "La cédula que ingresaste es inválida" });
    }

    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ _id: { $ne: person._id }, CI: CI }).exec();
    const isEmailNotDuplicated = await Person.findOne({ _id: { $ne: person._id }, email: email }).exec();

    //Emite un error en el caso de que la cédula pertenezca a otro usuario
    if (isCINotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "La cédula pertenece a otro usuario" });

    }

    //Emite un error en el caso de que el correo pertenezca a otro usuario
    if (isEmailNotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      console.log("El correo pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "El correo pertenece a otro usuario" });

    }

    const institution = await Institution.findOne({ nameInstitution }).session(
      session
    );

    if (!institution) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "La institución no esta registrada" });
    }

    //Si el dece se cambia de institucion..
    if (person.institution.nameInstitution !== nameInstitution) {
      console.log("entra")
      try {
        // Buscar deces de la misma institución
        const deceAlternative = await Dece.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userData",
            },
          },
          {
            $unwind: "$userData"
          },
          {
            $lookup: {
              from: "people",
              localField: "userData.person",
              foreignField: "_id",
              as: "personData",
            },
          },
          {
            $unwind: {
              path: "$personData",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "institutions",
              localField: "personData.institution",
              foreignField: "_id",
              as: "institutionData",
            },
          },
          {
            $unwind: {
              path: "$institutionData",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $match: {
              "institutionData.nameInstitution": person.institution.nameInstitution,
              "personData._id": { $ne: person._id } // Excluir el person._id
            },
          },
          { $limit: 1 } // Limitar a 1 resultado
        ]).session(session);



        // Reasignar los casos al primer dece encontrado
        const firstDece = deceAlternative[0];
        const casos = await Caso.find({ dece }).lean().session(session);
        const casoIds = casos.map((caso) => caso._id);

        if (deceAlternative.length === 0 && casos.length > 0) {
          return res
            .status(400)
            .send({ error: "No es posible editar la institución, no hay mas deces registrados en la institución" });
        }

        if (deceAlternative.length > 0 && casos.length > 0) {
          await Caso.updateMany(
            { _id: { $in: casoIds } },
            { $set: { dece: firstDece._id } },
            { session }
          );

          console.log(`Se han reasignado ${casos.length} casos al dece: ${deceAlternative?.userData?.personData?.name} ${deceAlternative?.userData?.personData?.lastName}`);
        }
      } catch (error) {
        // Manejo de errores durante la resignación de casos
        console.log("Error al reasignar casos:", error);
        return res.status(400).send({ error: "Error al reasignar casos" });
      }
    }

    //Se va a buscar el dece por el email del usuario mismo que pertenece ala persona
    const updateDece = await Person.findByIdAndUpdate(
      person._id,
      {
        CI,
        name,
        lastName,
        address,
        phone,
        email,
        institution: institution._id,
      },
      { new: true, session }
    );

    await logsAudit(req, 'UPDATE', 'DECE', updateDece, Object.keys(req.body), "Actualizar DEDE");

    // Commit de la transacción y finalización de la sesión
    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ message: "Dece actualizado correctamente", data: updateDece });
  } catch (error) {
    // Manejo de errores generales
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(400).send(`${error}Error al actualizar el dece`);
  }
};


// Delete a dece with the specified id in the request
exports.deleteDece = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { id } = req.params;

    const dece = await Dece.findById(id)
      .populate({
        path: "user",
        populate: {
          path: "person",
          select: "-_id CI",
        },
      })
      .session(session);

    if (!dece) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ error: "Dece no encontrado" });
    }

    const casoCount = await Caso.countDocuments({ dece: id }).session(
      session
    );

    if (dece.user.person === null && casoCount === 0) {
      const userDeleted = await User.findByIdAndRemove(dece.user._id).session(session);
      await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado físico de usuario por DEDE");
      const deceDeleted = await Dece.findByIdAndRemove(id).session(session);
      await logsAudit(req, 'DELETED', 'DECE', deceDeleted, "", "Eliminado físico DEDE");
      await session.commitTransaction();
      session.endSession();
      return res.status(200).send({ message: "Dece eliminado correctamente" });
    }

    if (dece.user === null && casoCount === 0) {
      const deceDeleted = await Dece.findByIdAndRemove(id).session(session);
      await logsAudit(req, 'DELETED', 'DECE', deceDeleted, "", "Eliminado físico DEDE");
      await session.commitTransaction();
      session.endSession();
      return res.status(200).send({ message: "Dece eliminado correctamente" });
    }

    if (casoCount > 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: `El dece tiene ${casoCount} casos asociados` });
    }

    const personDeleted = await Person.findOneAndRemove({ CI: dece.user.person.CI }).session(session);
    await logsAudit(req, 'DELETED', 'PERSON', personDeleted, "", "Eliminado físico de persona por DEDE");
    const userDeleted = await User.findByIdAndRemove(dece.user._id).session(session);
    await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado físico de usuario por DEDE");
    const deceDeleted = await Dece.findByIdAndRemove(id).session(session);
    await logsAudit(req, 'DELETED', 'DECE', deceDeleted, "", "Eliminado físico DEDE");

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ message: "Docente eliminado correctamente" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();

    res.status(500).send({ error: "Error al eliminar el docente" });
  }
};
