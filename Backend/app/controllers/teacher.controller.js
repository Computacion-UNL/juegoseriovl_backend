const mongoose = require("mongoose");

const Institution = require("../models/institution.model.js");
const Teacher = require("../models/teacher.model.js");
const Person = require("../models/person.model.js");
const User = require("../models/user.model.js");
const Caso = require("../models/caso.model.js");
const { logsAudit } = require('../utils/helpers/auditEvent.js');
const { encrypt } = require("../utils/helpers/handle.password");
const { sendRecoveryCodeEmail } = require("../../config/mail.conf");
const { validateIDCard, generatorPass } = require("../utils/helpers/tools.js");

// Create and Save a new teacher
exports.createTeacher = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { CI, name, lastName, address, phone, email, nameInstitution } = req.body;

    //Verificamos la validez de la cédula
    const validateCard = await validateIDCard(CI);
    
    //Emitimos un error en caso de que la cédula sea errónea
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

    //Verifica la existencia de la institución 
    const existingInstitution = await Institution.findOne({ nameInstitution }).session(session)
    //Emite un error si la institución no existe
    if (!existingInstitution) {
      await session.abortTransaction();
      session.endSession();
      console.log("La institución no se encuentra registrada");
      return res.status(400).send({ error: "La institución no se encuentra registrada" });
   }

  
   
    //Genera una contraseña de Mayúsculas, minúsculas y números
    const pass =  generatorPass();
    //Encripta la contraseña
    const hashedPassword = await encrypt(pass)
        //Guarda los datos para enviar el correo.
    const subject = 'SeriusGame - Nueva cuenta'
    const operation = 0;



    const newPerson = await Person.create({ CI, name, lastName, address, phone, email, institution: existingInstitution._id })
    const user = await User.create({ password: hashedPassword, person: newPerson._id, role: "TEACHER" })
    const teacher = await Teacher.create({ user: user._id })

    await logsAudit(req, 'CREATE', 'TEACHER', teacher, Object.keys(req.body), "Registro TEACHER");

   //Enviamos el correo  con los datos 
    const result = await sendRecoveryCodeEmail(email, pass , subject, operation)
    if (result) {
      console.log(`Código enviado exitosamente`);
    } else {
      console.log(`Error al enviar el código`);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ message: "Docente creado exitosamente" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al crear el docente" });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate({
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

    const listaTeacher = await Promise.all(
      teachers.map(async (teacher) => {
        const user = teacher.user;
        const person = user?.person;
        const institution = person?.institution;
        return {
          id: teacher._id,
          CI: person ? person.CI : null,
          name: person ? person.name : null,
          lastName: person ? person.lastName : null,
          phone: person ? person.phone : null,
          email: person ? person.email : null,
          nameInstitution: institution
            ? person.institution.nameInstitution
            : null,
          role: user ? user.role : null,
          status: user ? user.status : null,
        };
      })
    );

    res.status(200).send({
      message: "Datos docente obtenidos exitosamente",
      data: listaTeacher,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al obtener los docentes");
  }
};

exports.getTeachersCasos = async (req, res) => {
  try {
    const { data } = req.body;

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "people",
          localField: "user.person",
          foreignField: "_id",
          as: "user.person",
        },
      },
      { $unwind: "$user.person" },
      {
        $lookup: {
          from: "institutions",
          localField: "user.person.institution",
          foreignField: "_id",
          as: "user.person.institution",
        },
      },
      { $unwind: "$user.person.institution" },
      {
        $match: {
          "user.person.institution.nameInstitution": data,
        },
      },
      {
        $project: {
          id: { $ifNull: ["$_id", null] },
          CI: { $ifNull: ["$user.person.CI", null] },
          name: { $ifNull: ["$user.person.name", null] },
          lastName: { $ifNull: ["$user.person.lastName", null] },
          phone: { $ifNull: ["$user.person.phone", null] },
          email: { $ifNull: ["$user.person.email", null] },
          nameInstitution: { $ifNull: ["$user.person.institution.nameInstitution", null] },
          role: { $ifNull: ["$user.role", null] },
          status: { $ifNull: ["$user.status", null] },
        },
      },
    ];

    const listaTeacher = await Teacher.aggregate(pipeline);

    res.status(200).send({
      message: "Datos docente obtenidos exitosamente",
      data: listaTeacher,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al obtener los docentes");
  }
};


exports.getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id)
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
      })
      .lean();

    if (!teacher) {
      return res.status(400).send({ error: "Docente no encontrado" });
    }

    const teacherData = {
      id: teacher._id,
      CI: teacher.user?.person ? teacher.user.person.CI : null,
      name: teacher.user?.person ? teacher.user.person.name : null,
      lastName: teacher.user?.person
        ? teacher.user.person.lastName
        : null,
      address: teacher.user?.person
        ? teacher.user.person.address
        : null,
      phone: teacher.user?.person ? teacher.user.person.phone : null,
      email: teacher.user?.person ? teacher.user.person.email : null,
      nameInstitution: teacher.user?.person?.institution
        ? teacher.user?.person?.institution?.nameInstitution
        : null,
      role: teacher?.user ? teacher.user.role : null,
      status: teacher?.user ? teacher.user.status : null,
    };

    res
      .status(200)
      .send({ message: "Docente  encontrado con exitosamente!", data: teacherData });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al obtener el docente");
  }
};

exports.updateTeacher = async (req, res) => {
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
    const teacher = await Teacher.findById(id).session(session);
    //Busca la existencia del usuario
    const user = await User.findById(teacher.user).session(session);
    //Busca la existencia de la persona
    const person = await Person.findById(user.person)
    .populate({
      path:"institution",
      select:"nameInstitution"
    })
    .session(session);


    if (!teacher || !user || !person) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El docente no se encuentra registrado" });
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
    if (isCINotDuplicated){
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "La cédula pertenece a otro usuario"});
    }

    //Emite un error en el caso de que el correo pertenezca a otro usuario
    if (isEmailNotDuplicated){
      await session.abortTransaction();
      session.endSession();
      console.log("El correo pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "El correo pertenece a otro usuario"});
    }

    const institution = await Institution.findOne({ nameInstitution }).session(
      session
    );

    if (!institution) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "La institución no está registrada" });
    }

      //Si el docente se cambia de institución..
    if (person.institution.nameInstitution !== nameInstitution) {
      
      try{ 
        const casos = await Caso.find({ teacher }).lean().session(session);
        const casoIds = casos.map((caso) => caso._id);
        if( casos.length>0){
           await Caso.updateMany(
          { _id: { $in: casoIds } },
          { $set: { teacher: null } },
          { session }
        );

        }
      } catch (error) {
        // Manejo de errores durante la resignación de casos
        console.log("Error al reasignar casos:", error);
        return res.status(400).send({ error: "Error al reasignar casos" });
      }
    }

   

    const updatedTeacher = await Person.findByIdAndUpdate(
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


    await logsAudit(req, 'UPDATE', 'TEACHER', updatedTeacher, Object.keys(req.body), "Actualizar Docente");

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({
      message: "Docente actualizado exitosamente",
      data: updatedTeacher,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(400).send({ error: "Error al actualizar el docente" });
  }
};

// Delete a teacher with the specified teacherId in the request
exports.deleteTeacher = async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const teacherId = req.params.id;

    const teacher = await Teacher.findById(teacherId)
      .populate({
        path: "user",
        populate: {
          path: "person",
          select: "-_id CI",
        },
      })
      .session(session);

    if (!teacher) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ error: "Docente no encontrado" });
    }

    const casoCount = await Caso.countDocuments({ teacher: teacherId }).session(
      session
    );

    if (teacher.user.person === null && casoCount === 0) {
      const userDeleted = await User.findByIdAndRemove(teacher.user._id).session(session);
      await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado físico de usuario por Docente");
      const teacherDeleted = await Teacher.findByIdAndRemove(teacherId).session(session);
      await logsAudit(req, 'DELETED', 'DECE', teacherDeleted, "", "Eliminado físico Docente");
      await session.commitTransaction();
      session.endSession();
      return res.status(200).send({ message: "Docente eliminado correctamente" });
    }

    if (teacher.user === null && casoCount === 0) {
      const teacherDeleted = await Teacher.findByIdAndRemove(teacherId).session(session);
      await logsAudit(req, 'DELETED', 'DECE', teacherDeleted, "", "Eliminado físico Docente");
      await session.commitTransaction();
      session.endSession();
      return res.status(200).send({ message: "Docente eliminado correctamente" });
    }

    if (casoCount > 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: `El docente tiene ${casoCount} casos asociados` });
    }

    const personDeleted = await Person.findOneAndRemove({  CI: teacher.user.person.CI  }).session(session);
    await logsAudit(req, 'DELETED', 'PERSON', personDeleted, "", "Eliminado físico de persona por Docente");
    const userDeleted = await User.findByIdAndRemove(teacher.user._id).session(session);
    await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado físico de usuario por Docente");
    const teacherDeleted = await Teacher.findByIdAndRemove(teacherId).session(session);
    await logsAudit(req, 'DELETED', 'DECE', teacherDeleted, "", "Eliminado físico Docente");

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
