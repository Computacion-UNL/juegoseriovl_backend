const TestTeacher = require("../models/testTeacher.model.js");
const TestQuestion = require("../models/testQuestion.model.js");
const Dece = require("../models/dece.model.js");
const Caso = require("../models/caso.model.js");
const User = require("../models/user.model.js");
const { logsAudit } = require('../utils/helpers/auditEvent.js');

exports.findAll = async (req, res) => {
  try {
    const { id } = req.params;

    // Encuentra usuario y dece
    const [user, dece] = await Promise.all([
      User.findById(id),
      Dece.findOne({ user: id }),
    ]);



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
      { $match: { dece: dece._id } },
      {
        $project: {
          "personTeacherData": 1,
          "personStudentData": 1
        }
      },
    ]);


    if (result.length === 0) {
      return res.status(200).send({ message: "No hay registros", data: [] });
    }

    const casos = result;

    //Encuentra todos los testTeachers relacionados con los casos
    const testTeachersCase = await TestTeacher.find({ caso: { $in: casos.map((test) => test._id) }, isDeleted: false }).lean();

    // Construir la respuesta formateando los datos
    const listTests = testTeachersCase.map((test) => {
      
      const caso = casos ? casos.find((s) => s._id.toString() === test.caso.toString()) : null;

      if (!test) return null;

      return {
        //datos del test
        id: test._id ? test._id : null,
        scoreMax: test.scoreMax ? test.scoreMax : 0,
        score: test.score ? test.score : 0,
        statusTestTeacher: test.status ? test.status : false,
        scoreEvaluator: test.scoreEvaluator ? test.scoreEvaluator : 0,
        createAt: test.createdAt ? test.createdAt : null,
        //datos del estudiante
        ciStudent: caso?.personStudentData ? caso.personStudentData.CI : null,
        nameStudent: caso?.personStudentData ? caso.personStudentData.name : null,
        lastNameStudent: caso?.personStudentData ? caso.personStudentData.lastName : null,
        //datos del Teacher
        ciTeacher: caso?.personTeacherData ? caso.personTeacherData.CI : null,
        nameTeacher: caso?.personTeacherData ? caso.personTeacherData.name : null,
        lastNameTeacher: caso?.personTeacherData ? caso.personTeacherData.lastName : null,
      };
    });

    // Filtrar cualquier objeto nulo que haya quedado en el array
    const filteredListTests = listTests.filter((test) => test !== null);


    res.status(200).send({ message: "Datos obtenidos correctamente", data: filteredListTests });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error al encontrar testTeacher" });
  }
};

exports.getTestTeacher = async (req, res) => {
  try {
    const testUp = await TestTeacher.findOne({ caso: req.params.id, isDeleted:false });

    const test = await Promise.all(
      testUp.answers.map(async (answer) => {
        const select = await TestQuestion.findById(answer.refQuestion);
        return {
          name: select?.nameQuestion || null,
          value: answer.valueAnswer || 0,
        };
      })
    );

    res.status(200).send(test);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al encontrar testTeacher" });
  }
};


exports.deleteOne = async (req, res) => {
  try {
    const { remarks } = req.body;
    // Encuentra el objeto por su ID y actualiza el campo "isDeleted" a true
    const testTeacher = await TestTeacher.findByIdAndUpdate(req.params.id, { isDeleted: true, status:false }, { new: true });
    await logsAudit(req, 'DELETE', 'TestTeacher', testTeacher, "", remarks);


 
    res.status(200).send({ message: "Test Teacher eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error al eliminar testTeacher" });
  }
};
