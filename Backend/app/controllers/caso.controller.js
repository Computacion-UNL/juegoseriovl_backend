const mongoose = require("mongoose");

const Caso = require("../models/caso.model.js");
const User = require("../models/user.model.js");
const Dece = require("../models/dece.model.js");
const Student = require("../models/student.model.js");
const Teacher = require("../models/teacher.model.js");
const Person = require("../models/person.model.js");
const TestStudent = require("../models/testStudent.model.js");
const TestTeacher = require("../models/testTeacher.model.js");
const TestQuestion = require("../models/testQuestion.model.js");
const Institution = require("../models/institution.model.js");
const { logsAudit } = require('../utils/helpers/auditEvent.js');
const { validateIDCard, calculateCsr } = require("../utils/helpers/tools.js");

// Create and Save a new caso    Listo el create
exports.create = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    //Ingreso de datos
    const {
      ciStudent,
      nameStudent,
      lastNameStudent,
      gender,
      ageStudent,
      addressStudent,
      phoneStudent,
      gradeStudent,
      parallelStudent,
      ciTeacher, //Docente para el caso
      idDece, //Dece para el caso
      nameInstitution, //institución para el docente
    } = req.body;

    //Comprueba la cédula
    const validateCard = await validateIDCard(ciStudent);

    //Si la cédula es invalida este emitirá un mensaje de error
    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "La cédula que ingresaste es inválida" });
    }

    //Comprueba la existencia de la institución
    const institution = await Institution.findOne({ nameInstitution }).session(session);

    //Si la institución no es encontrada este emitirá un mensaje de error 
    if (!institution) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "Institución no registrada" });
    }

    //Comprueba si el estudiante ya ha sido registrado
    const personStudent = await Person.findOne({ CI: ciStudent }).session(session);

    //devuelve una alerta si el estudiante ya esta registrado
    if (personStudent) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "La cédula pertenece a un usuario registrado" });
    }
    //Crea la persona 
    const person = new Person({
      name: nameStudent,
      lastName: lastNameStudent,
      gender: gender,
      age: ageStudent,
      address: addressStudent,
      phone: phoneStudent,
      CI: ciStudent,
      institution: institution._id,
    });

    //Crea el estudiante
    const student = new Student({
      person: person._id,
      grade: gradeStudent,
      parallel: parallelStudent,
    });

    //Los guarda en las colecciones para el estudiante
    await person.save({ session });
    await student.save({ session });



    let teacher = await Teacher.aggregate([
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
        $match: {
          "personData.CI": ciTeacher,
        },
      },
    ]).session(session);



    const teacherFound = teacher.length > 0 ? teacher[0] : null;

    //Se emite un error si el docente no se encuentra registrado
    if (!teacherFound) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "El docente no se encuentra registrado.." });
    }

    const deceFound = await Dece.findOne({ user: idDece }).session(session);

    //Se emite un error si el docente no se encuentra registrado
    if (!deceFound) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "El dece no se encuentra registrado.." });
    }

    const caso = await new Caso({
      dece: deceFound._id,
      teacher: teacherFound._id,
      student: student._id,
      dateStart: Date.now(),
    }).save({ session });

    await logsAudit(req, 'CREATE', 'Caso', caso, Object.keys(req.body), "Caso creado");

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ message: "Caso creado con éxito!" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al crear el caso" });
  }
};

exports.update = async (req, res) => {
  console.log(req.body);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      idStudent,
      ciStudent,
      nameStudent,
      lastNameStudent,
      gender,
      ageStudent,
      addressStudent,
      phoneStudent,
      gradeStudent,
      parallelStudent,
      ciTeacher,
    } = req.body;



    //Busca la existencia del dece      
    const student = await Student.findById(idStudent).session(session);
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
    const validateCard = await validateIDCard(ciStudent);

    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula que ingresaste es inválida");
      return res
        .status(400)
        .send({ error: "La cédula que ingresaste es inválida" });
    }

    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ _id: { $ne: person._id }, CI: ciStudent }).exec();

    //Emite un error en el caso de que la cédula pertenezca a otro usuario
    if (isCINotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula pertenece a otro usuario")
      return res
        .status(400)
        .send({ error: "La cédula pertenece a otro usuario" });
    }


    // Actualizar información del estudiante
    const personStudent = await Person.findOneAndUpdate(
      { CI: ciStudent },
      {
        $set: {
          name: nameStudent,
          lastName: lastNameStudent,
          gender,
          age: ageStudent,
          address: addressStudent,
          phone: phoneStudent,
        },
      },
      { new: true, session }
    );

    // Actualizar información del estudiante en la colección Student
    await Student.findOneAndUpdate(
      { person: personStudent._id },
      { $set: { grade: gradeStudent, parallel: parallelStudent } },
      { new: true, session }
    );

    const newTeacher = await Teacher.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userTeacherData",
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "userTeacherData.person",
          foreignField: "_id",
          as: "personaTeacherData",
        },
      },
      {
        $match: {
          "personaTeacherData.CI": ciTeacher,
        },
      },
    ]);

    if (newTeacher.length > 0) {
      console.log(newTeacher[0]);
    } else {
      console.log("Profesor no encontrado");
    }

    // Actualizar el profesor del caso
    const caso = await Caso.findByIdAndUpdate(
      id,
      { teacher: newTeacher[0]._id },
      { new: true, session }
    );


    await logsAudit(req, 'UPDATE', 'Caso', caso, Object.keys(req.body), "Caso actualizado");

    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ message: "Caso actualizado exitosamente" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al actualizar el caso" });
  }
};


exports.testStudent = async (req, res) => {
  console.log(req.body);
  try {
    const { CIstudent, answers } = req.body;

    const caso = await Caso.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "studentData.person",
          foreignField: "_id",
          as: "personaData",
        },
      },
      {
        $match: {
          "personaData.CI": CIstudent,
        },
      },
    ]);

    // Verificar si el usuario existe
    if (caso.length == 0) {
      console.log("Caso no encontrado o borrado previamente")
      return res
        .status(400)
        .send({ error: "Caso no encontrado o borrado previamente" });
    }

    const testOld = await TestStudent.findOne({ caso: caso._id, idDeleted: false }).lean();

    if (testOld) {
      return res.status(400).send({ error: "El test ya ha sido ejecutado" });
    }

    const scoreMax = answers.length + 1;

    const score = answers.reduce(
      (total, answer) => total + answer.valueAnswer,
      0
    );

    const percent = calculateCsr(score);
    let diagnostic;

    if (percent < 84) {
      diagnostic = "El alumno no presenta indicadores.";
    } else if (percent >= 100) {
      diagnostic = "El alumno presenta una probabilidad ALTA de haber sido víctima de violencia sexual.";
    } else if (percent >= 96 && percent < 100) {
      diagnostic = "El alumno presenta una probabilidad MODERADA de haber sido víctima de violencia sexual.";
    } else {
      diagnostic = "El alumno presenta un riesgo LEVE de haber sido víctima de violencia sexual.";
    }


    const testStudent = await new TestStudent({
      caso: caso[0]._id,
      scoreMax,
      score: score,
      diagnostic: diagnostic,
      answers,
      status: true
    }).save();

    const response = {
      score,
      diagnostic,
    };
    await logsAudit(req, 'CREATE', 'TestStudent', testStudent, Object.keys(req.body), "Test Estudiante aplicado");

    res.status(201).send({ message: "ok", data: response });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error creating Caso" });
  }
};

exports.testTeacher = async (req, res) => {
  console.log(req.body);
  try {
    const { ciStudent, ciTeacher, answers } = req.body;

    const caso = await Caso.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "studentData.person",
          foreignField: "_id",
          as: "personaData",
        },
      },

      {
        $lookup: {
          from: "teachers",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherData",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherData.user",
          foreignField: "_id",
          as: "userTeacherData",
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "userTeacherData.person",
          foreignField: "_id",
          as: "personaTeacherData",
        },
      },
      {
        $match: {
          $and: [
            { "personaData.CI": ciStudent },
            { "personaTeacherData.CI": ciTeacher },
          ],
        },
      },
    ]);

    // Verificar si el usuario existe
    if (caso.length == 0) {
      return res
        .status(400)
        .send({ error: "Caso no encontrado o borrado previamente" });
    }



    const testOld = await TestQuestion.findOne({ caso: caso._id, idDeleted: false }).lean();

    if (testOld) {
      return res.status(400).send({ error: "El test ya ha sido ejecutado" });
    }

    const questions = await TestQuestion.find();
    const scoreMax = questions.reduce(
      (sum, question) =>
        sum + question.answer[question.answer.length - 1].valueAnswer,
      0
    );
    const score = answers.reduce(
      (total, answer) => total + answer.valueAnswer,
      0
    );
    const percent = (score / scoreMax) * 100;

    let diagnostic;
    if (percent >= 65.08) {
      diagnostic =
        "El alumno presenta un riesgo GRAVE de haber sido víctima de violencia sexual";
    } else if (percent >= 31.75) {
      diagnostic =
        "El alumno presenta un riesgo MODERADO de haber sido victima de violencia sexual";
    } else {
      diagnostic =
        "El alumno presenta un riesgo LEVE de haber sido victima de violencia sexual";
    }
    const testTeacher = await new TestTeacher({
      caso: caso[0]._id,
      scoreMax,
      score: score,
      answers,
      diagnostic: diagnostic,
      status:true
    }).save();

    await logsAudit(req, 'CREATE', 'TestTeacher', testTeacher, Object.keys(req.body), "Test Docente aplicado");

    res.status(201).send({ message: "Test Docente creado con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error al crear Test Docente" });
  }
};


exports.findAll = async (req, res) => {
  try {
    const { id } = req.params;

    const dece = await Dece.findOne({ user: id }).lean();

    const result = await Caso.aggregate([
      {
        $lookup: {
          from: "teachers",
          localField: "teacher",
          foreignField: "_id",
          as: "teacherData",
        },
      },
      {
        $unwind: {
          path: "$teacherData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "teacherData.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "people",
          localField: "userData.person",
          foreignField: "_id",
          as: "personTeacherData",
        },
      },
      {
        $unwind: {
          path: "$personTeacherData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "institutions",
          localField: "personTeacherData.institution",
          foreignField: "_id",
          as: "institutionTeacherData",
        },
      },
      {
        $unwind: {
          path: "$institutionTeacherData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $lookup: {
          from: "people",
          localField: "studentData.person",
          foreignField: "_id",
          as: "personStudentData",
        },
      },
      {
        $unwind: {
          path: "$personStudentData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "institutions",
          localField: "studentData.institution",
          foreignField: "_id",
          as: "institutionStudentData",
        },
      },
      {
        $unwind: {
          path: "$institutionStudentData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: { dece: dece._id, isDeleted: false } },
      {
        $project: {
          dateStart: 1,
          "studentData": 1,
          "personTeacherData": 1,
          "personStudentData": 1,
          "institutionStudentData": 1,
          "institutionTeacherData": 1
        }
      },
    ]);

    if (result.length === 0) {
      return res.status(200).send({ message: "No hay registros", data: [] });
    }

    const casos = result;

    //Encuentra todos los testTeachers relacionados con los casos
    const testTeachersCase = await TestTeacher.find({ caso: { $in: casos.map((test) => test._id) }, isDeleted: false }).lean();
    //Encuentra todos los testStudents relacionados con los casos
    const testStudentsCase = await TestStudent.find({ caso: { $in: casos.map((test) => test._id) }, isDeleted: false }).lean();

    console.log(testStudentsCase)

    const listaCasos = casos.map((caso) => {
      const student = caso?.personStudentData;
      const teacher = caso?.personTeacherData;


      const testStudent = testStudentsCase ? testStudentsCase.find((s) => s.caso.toString() === caso._id.toString()) : null;
      const testTeacher = testTeachersCase ? testTeachersCase.find((s) => s.caso.toString() === caso._id.toString()) : null;


      return {
        //Datos del caso listo
        _id: caso._id,
        dateStart: caso?.dateStart || null,

        //Datos del estudiante
        ciStudent: student.CI || null,
        nameStudent: student.name || null,
        lastNameStudent: student.lastName || null,
        gradeStudent: caso.studentData.grade || null,
        parallelStudent: caso.studentData.parallel || null,
        nameInstitutionStudent: caso?.institutionStudentData?.nameInstitution || null,

        //Datos del teacher
        ciTeacher: teacher?.CI || null,
        nameTeacher: teacher?.name || null,
        lastNameTeacher: teacher?.lastName || null,
        emailTeacher: teacher?.email || null,
        nameInstitutionTeacher: caso?.institutionTeacherData?.nameInstitution || null,

        //Datos de test
        statusTestStudent: testStudent?.status || false,
        statusTestTeacher: testTeacher?.status || false,
      };
    });

    console.log(listaCasos)

    res
      .status(200)
      .send({ message: "Datos extraídos correctamente ", data: listaCasos });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al buscar los casos" });
  }
};

//Extrae todos los estudiantes que estan vinculados al docente por id
exports.getAllStudentsXTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const userTeacher = await User.findById(id).select("_id").lean().exec();

    if (!userTeacher) {
      return res.status(404).send({ message: "Docente no encontrado" });
    }

    const teacher = await Teacher.findOne({ user: userTeacher._id })
      .select("_id")
      .populate({
        path: "user",
        populate: {
          path: "person",
          select: "-_id CI name lastName phone email ",
        },
      })
      .lean()
      .exec();

    if (!teacher) {
      return res.status(404).send({ message: "Docente no encontrado" });
    }

    const casoIds = await Caso.find({ teacher: teacher._id, isDeleted: false })
      .select("_id")
      .lean()
      .exec();

    if (casoIds.length === 0) {
      return res.status(200).send({ message: "No hay casos asignados" });
    }

    const casoPromises = casoIds.map((caso) => {
      return Caso.findById(caso._id)
        .populate("student", "_id")
        .populate("teacher", "_id")
        .lean()
        .exec();
    });

    const casos = await Promise.all(casoPromises);

    const studentIds = casos.map((caso) => caso.student);

    const students = await Student.find({ _id: { $in: studentIds } })
      .select("_id")
      .populate({
        path: "person",
        select: "-_id CI name lastName phone email institution gender",
        populate: {
          path: "institution",
          select: "-_id nameInstitution",
        },
      })
      .lean()
      .exec();

    const listCaso = await Promise.all(
      casos.map(async (caso) => {
        const student = students.filter(
          (student) => String(student._id) === String(caso.student._id)
        )[0];

        const testTeacher = await TestTeacher.findOne({
          caso: caso._id,
        }).exec();

        return {
          id: caso._id || "no asignado",
          idStudent: student ? student._id : "no asignado",
          name: student?.person?.name || "no asignado",
          lastName: student?.person?.lastName || "no asignado",
          gender: student?.person?.gender || "no asignado",
          CI: student?.person?.CI || "no asignado",
          nameT: teacher?.user?.person?.name || "no asignado",
          lastNameT: teacher?.user?.person?.lastName || "no asignado",
          CIteacher: teacher?.user?.person?.CI || "no asignado",
          institution:
            student?.person?.institution?.nameInstitution || "no asignado",
          dateStart: caso.dateStart || "no asignado",
          statusTestTeacher: testTeacher ? testTeacher.status : false,
        };
      })
    );
    res.status(200).send({ message: "Datos  recuperados con éxito", data: listCaso });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al recuperar caso" });
  }
};

exports.getReporte = async (req, res) => {
  console.log("llegue al reporte")
  const { id } = req.params;

  try {
    const caso = await Caso.findOne({_id:id, isDeleted: false})
      .populate({
        path: "student",
        select: "grade parallel",
        populate: {
          path: "person",
          select: "name lastName CI email gender",
          populate: {
            path: "institution",
            select: "nameInstitution",
          },
        },
      })
      .populate({
        path: "dece",
        select: "",
        populate: {
          path: "user",
          select: "role",
          populate: {
            path: "person",
            select: "name lastName CI email",
          },
        },
      })
      .populate({
        path: "teacher",
        select: "",
        populate: {
          path: "user",
          select: "role",
          populate: {
            path: "person",
            select: "name lastName CI email",
          },
        },
      })
      .lean();
      console.log(caso)
    if (!caso) {
      return res.status(404).send({ error: "Caso no encontrado" });
    }

    const [testStudent, testTeacher] = await Promise.all([
      TestStudent.findOne({ caso: caso._id, isDeleted:false }),
      TestTeacher.findOne({ caso: caso._id, isDeleted:false }),
    ]);

    const casoData = {
      id: caso._id,
      dateStart: caso.dateStart || null,
      ciStudent: caso.student?.person?.CI || "no asignado",
      nameStudent: caso.student?.person?.name || "no asignado",
      lastNameStudent: caso.student?.person?.lastName || "no asignado",
      gender: caso.student?.person?.gender || "no asignado",
      nameInstitutionStudent:
        caso.student?.person?.institution?.nameInstitution || "no asignado",
      grade: caso.student?.grade || "no asignado",
      parallel: caso.student?.parallel || "no asignado",
      ciTeacher: caso.teacher?.user?.person?.CI || "no asignado",
      nameTeacher: caso.teacher?.user?.person?.name || "no asignado",
      lastNameTeacher: caso.teacher?.user?.person?.lastName || "no asignado",
      emailTeacher: caso.teacher?.user?.person?.email || "no asignado",
      ciDece: caso.dece?.user?.person?.CI || "no asignado",
      nameDece: caso.dece?.user?.person?.name || "no asignado",
      lastNameDece: caso.dece?.user?.person?.lastName || "no asignado",
      emailDece: caso.dece?.user?.person?.email || "no asignado",

      statusTestStudent: testStudent?.status || false,
      diagnosticStudent: testStudent?.diagnostic || "no asignado",
      scoreMaxStudent: testStudent?.scoreMax || null,
      scoreStudent: testStudent?.score || null,
      scoreEvaluator: testStudent?.scoreEvaluator || null,

      statusTestTeacher: testTeacher?.status || false,
      diagnosticTeacher: testTeacher?.diagnostic || "no asignado",
      scoreMaxTeacher: testTeacher?.scoreMax || null,
      scoreTeacher: testTeacher?.score || null,
    };

    res.send({ message: "Caso encontrado", data: casoData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al buscar el caso" });
  }
};

exports.getCaso = async (req, res) => {
  const { id } = req.params;

  try {
    const caso = await Caso.findOne({_id:id, idDeleted: false})
      .populate({
        path: "student",
        select: "_id grade parallel",
        populate: {
          path: "person",
          select: "name lastName CI  gender age",
          populate: {
            path: "institution",
            select: "nameInstitution",
          },
        },
      })
      .populate({
        path: "dece",
        select: "",
        populate: {
          path: "user",
          select: "role",
          populate: {
            path: "person",
            select: "name lastName CI email",
          },
        },
      })
      .populate({
        path: "teacher",
        select: "",
        populate: {
          path: "user",
          select: "role",
          populate: {
            path: "person",
            select: "name lastName CI email",
          },
        },
      })
      .lean();

    if (!caso) {
      return res.status(404).send({ error: "Caso no encontrado" });
    }



    const casoData = {
      id: caso._id,
      dateStart: caso.dateStart || null,
      idStudent: caso.student._id || null,
      ciStudent: caso.student?.person?.CI || null,
      nameStudent: caso.student?.person?.name || null,
      lastNameStudent: caso.student?.person?.lastName || null,
      addressStudent: caso.student?.person?.address || null,
      phoneStudent: caso.student?.person?.phone || null,
      ageStudent: caso.student?.person?.age || null,
      gender: caso.student?.person?.gender || null,
      nameInstitutionStudent:
        caso.student?.person?.institution?.nameInstitution || null,
      grade: caso.student?.grade || null,
      parallel: caso.student?.parallel || null,
      ciTeacher: caso.teacher?.user?.person?.CI || null,
      nameTeacher: caso.teacher?.user?.person?.name || null,
      lastNameTeacher: caso.teacher?.user?.person?.lastName || null,
      emailTeacher: caso.teacher?.user?.person?.email || null,
      ciDece: caso.dece?.user?.person?.CI || null,
      nameDece: caso.dece?.user?.person?.name || null,
      lastNameDece: caso.dece?.user?.person?.lastName || null,
      emailDece: caso.dece?.user?.person?.email || null,

    };

    res.send({ message: "Caso encontrado", data: casoData });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al buscar el caso" });
  }
};


exports.delete = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const caso = await Caso.findById(id).session(session);

    const student = await Student.findById(caso.student).session(session);

    //Comprueba si el estudiante tiene test ejecutados
    const testTeacherPromise = await TestTeacher.findOne({ caso: caso._id, isDeleted:false }).session(session);
    const testStudentPromise = await TestStudent.findOne({ caso: caso._id, isDeleted:false }).session(session);

    if (testTeacherPromise || testStudentPromise) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "Error al eliminar caso, tiene test ejecutados.." });
    }


    if (student) {
      await Person.findByIdAndRemove(student.person).session(session);
      await Student.findByIdAndRemove(student._id).session(session);
      console.log("Se eliminaron el estudiante y persona vinculada")
    }

    //Elimina el caso  logico
    const casoDeleted = await Caso.findByIdAndUpdate(id, { isDeleted: true }).session(session);
    await logsAudit(req, 'DELETE', 'Caso', casoDeleted, "", remarks);

    await session.commitTransaction();
    session.endSession();

    res.send({ message: "Caso eliminado con éxito!" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al eliminar el caso" });
  }
};
