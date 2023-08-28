const mongoose = require("mongoose");

const Student = require("../models/student.model.js");
const Person = require("../models/person.model.js");
const Institution = require("../models/institution.model.js");
const Caso = require("../models/caso.model.js");
const { logsAudit } = require('../utils/helpers/auditEvent.js');
const { generateToken } = require("../utils/helpers/handle.jwt");
const { validateIDCard } = require("../utils/helpers/tools.js");


// Create and Save a new student
exports.createStudent = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      CI,
      name,
      lastName,
      address,
      phone,
      age,
      gender,
      nameInstitution,
      grade,
      parallel,
    } = req.body;

    //Verificamos la validez de la cédula
    const validateCard = await validateIDCard(CI).session(session);

    //Emitimos un error en caso de que la cédula sea errónea
    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula que ingresaste es inválida");
      return res.status(400).send({ error: "La cédula que ingresaste es inválida" });
    }

    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ CI }).exec().session(session);

    //si el email ya esta registrado retornamos un error
    if (isCINotDuplicated) {
      console.log("La cédula pertenece a un usuario registrado")
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "La cédula pertenece a un usuario registrado" });
    }



    const institution = await Institution.findOne({ nameInstitution }).session(
      session
    );

    if (!institution) {
      await session.abortTransaction();
      session.endSession();
      console.log("La institución no se encuentra registrada");
      return res.status(400).send({ error: "La institución no se encuentra registrada" });
    }

    const newPerson = await new Person({
      CI,
      name,
      lastName,
      address,
      phone,
      gender,
    }).save({ session });

    const student = await new Student({
      person: newPerson._id,
      institution: institution._id,
      grade,
      parallel,
    }).save({ session });
    await logsAudit(req, 'CREATE', 'STUDENT', student, Object.keys(req.body), "Registro Student");


    await session.commitTransaction();
    session.endSession();
    res.status(201).send({ message: "Estudiante creado exitosamente!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(400).send({ error: error + "Error creating student" });
  }
};

// Retrieve and return all students from the database.
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate({
      path: "person",
      select: "CI name lastName gender age  phone",
      populate: {
        path: "institution",
        select: "nameInstitution",
      },
    });

    const listaStudent = await Promise.all(
      students.map(async (student) => {
        const person = student.person;
        const institution = person?.institution;
        return {
          id: student._id,
          CI: person ? person.CI : "no asignado",
          name: person ? person.name : "no asignado",
          lastName: person ? person.lastName : "no asignado",
          gender: person ? person.gender : "no asignado",
          age: person ? person.age : "no asignado",
          gender: person ? person.gender : "no asignado",
          phone: person ? person.phone : "no asignado",
          nameInstitution: institution
            ? institution.nameInstitution
            : "no asignado",
          grade: student.grade,
          parallel: student.parallel,
          status: student.status,
        };
      })
    );

    res
      .status(200)
      .send({ message: "Estudiantes encontrados con éxito!", listaStudent });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al obtener los estudiantes");
  }
};

// Find a single student with a studentId
exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id)
      .select("person institution grade parallel")
      .populate({
        path: "person",
        select: "CI name lastName age  phone address gender",
        populate: {
          path: "institution",
          select: "nameInstitution",
        },
      })
      .lean();

    if (!student) {
      return res.status(400).send({ error: "Estudiante no encontrado" });
    }

    const studentData = {
      id: student._id,
      CI: student.person ? student.person.CI : "no asignado",
      name: student.person ? student.person.name : "no asignado",
      lastName: student.person ? student.person.lastName : "no asignado",
      gender: student?.person ? student.person.gender : "O",
      age: student.person ? student.person.age : "no asignado",
      address: student.person ? student.person.address : "no asignado",
      phone: student.person ? student.person.phone : "no asignado",
      gender: student.person ? student.person.gender : "no asignado",
      nameInstitution: student.person.institution.nameInstitution,
      grade: student.grade,
      parallel: student.parallel,
    };

    res.status(200).send({
      message: "Estudiante encontrado exitosamente!",
      data: studentData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error al obtener el estudiante");
  }
};

// Update a student identified by the studentId in the request
exports.updateStudent = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Llega el id a editar
    const { id } = req.params;
    //datos para modificar
    const {
      CI,
      name,
      lastName,
      address,
      phone,
      gender,
      age,
      nameInstitution,
      grade,
      parallel,
    } = req.body;

    //Busca la existencia del dece 
    const student = await Student.findById(id).session(session);
    //Busca la existencia de la persona
    const person = await Person.findById(student.person)
      .populate({
        path: "institution",
        select: "nameInstitution"
      })
      .session(session);

    if (!student || !person) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El estudiante no se encuentra registrado" });
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

    //Emite un error en el caso de que la cédula pertenezca a otro usuario
    if (isCINotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "La cédula pertenece a otro usuario" });
    }



    const institution = await Institution.findOne({ nameInstitution }).session(
      session
    );

    if (!institution) {
      return res
        .status(400)
        .send({ error: "La institución no está registrada" });
    }

    await Person.findByIdAndUpdate(person._id, {
      CI,
      name,
      lastName,
      address,
      phone,
      gender,
      age,
      institution
    }).session(session);

    const studentUpdate = await Student.findByIdAndUpdate(id, {
      parallel,
      grade,
    }).session(session);

    
    await logsAudit(req, 'UPDATE', 'STUDENT', studentUpdate, Object.keys(req.body), "Actualizar Student");

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({
      message: "Estudiante actualizado correctamente",
      data: studentUpdate,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(400).send({ error: "Error al actualizar el estudiante" });
  }
};

// Delete a student with the specified studentId in the request
exports.deleteStudent = async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const studentId = req.params.id;

    const student = await Student.findById(studentId)
      .populate({
        path: "person",
        select: "CI name lastName age phone address gender",
      })
      .session(session);

    if (!student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "Estudiante no encontrado" });
    }

    const caso = await Caso.findOne({ student: studentId }).session(session);

    if (student.person === null && !caso) {
      await Student.findByIdAndRemove(studentId).session(session);
      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .send({ message: "estudiante eliminado correctamente" });
    }

    if (caso) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El estudiante tiene un caso asociado" });
    }

    await Person.findOneAndRemove({ CI: student.person.CI }).session(session);
    await Student.findByIdAndRemove(studentId).session(session);

    await logsAudit(req, 'DELETE', 'STUDENT', student, Object.keys(req.body), "Eliminado Físico del estudiante");

    await session.commitTransaction();
    session.endSession();
    res.status(200).send({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al eliminar el estudiante" });
  }
};

//Generate passtemporaly and return passwordTemporaly
exports.generatePassStudent = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { CI } = req.body;

    const studentSearch = await Student.aggregate([
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
          "person.CI": CI,
        },
      },
    ]);

    // Verificar si el usuario existe
    if (studentSearch.length == 0) {
      return res.status(400).send({ error: "Estudiante encontrado" });
    }

    const student = studentSearch[0];

    const passwordTemporaly = Math.floor(100000 + Math.random() * 900000);

    student.passwordTemporaly = passwordTemporaly;
    student.passwordTemporalyExpiration = Date.now() + 300000; // 300000 milisegundos = 5 minutos
    // Limpiar el código de recuperación y su fecha de expiración después de 5 minutos
    setTimeout(() => {
      student.passwordTemporaly = null;
      student.passwordTemporalyExpiration = null;
      Student.findByIdAndUpdate(student._id, student).exec();
    }, 300000);

    const studentUpdate = await Student.findByIdAndUpdate(student._id, student).exec();

    await logsAudit(req, 'UPDATE', 'STUDENT', studentUpdate, Object.keys(req.body), "Generación de código");

    res.status(200).send({ message: "ok", data: student.passwordTemporaly });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al iniciar sesión.");
  }
};

//Login student
exports.loginStudent = async (req, res) => {
  console.log(req.body);
  try {
    const { passwordTemporaly } = req.body;

    const student = await Student.findOne({
      passwordTemporaly: passwordTemporaly,
    })
      .populate({
        path: "person",
        select: "CI name lastName age phone address",
        populate: {
          path: "institution",
          select: "nameInstitution",
        },
      })
      .lean();
    if (!student && student.passwordTemporaly !== passwordTemporaly) {
      return res.status(400).send({ message: "Credenciales incorrectas" });
    }

    if (student.passwordTemporalyExpiration < Date.now()) {
      return res.status(400).send({ message: "Código expirado" });
    }
    console.log(`Ingreso estudiante ${student?.person?.name} cédula: ${student?.person?.CI} `);
    let cedula = student.person.CI;
    const response = {
      id: student._id,
      name: `${student.person.name} ${student.person.lastName}`,
      institution: student.person.institution.nameInstitution,
      role: 'STUDENT',
    };
    const token = generateToken(response)
    const data = {
      cedula,
      token
    }
    res.status(200).send({ message: "ok", data });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al iniciar sesión" });
  }
};
