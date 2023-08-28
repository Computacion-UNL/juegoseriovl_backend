const TestStudent = require("../models/testStudent.model.js");
const Dece = require("../models/dece.model.js");
const Caso = require("../models/caso.model.js");
const User = require("../models/user.model.js");
const PdfPrinter = require("pdfmake");
const fs = require("fs");
const path = require("path");
const { logsAudit } = require('../utils/helpers/auditEvent.js');
const { calculateCsr } = require("../utils/helpers/tools.js");
const { obtenerDatosInforme, generarContenidoInforme } = require("../utils/helpers/reportStudent.js");

exports.findAll = async (req, res) => {
  try {
    const { id } = req.params;

    // Realizar múltiples consultas en paralelo para mejorar el rendimiento
    const [user, dece] = await Promise.all([
      User.findById(id),
      Dece.findOne({ user: id }),
    ]);


    const result = await Caso.aggregate([
      {
        $lookup: {
          from: "deces",
          localField: "dece",
          foreignField: "_id",
          as: "deceData",
        },
      },
      {
        $unwind: {
          path: "$deceData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "deceData.user",
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
          as: "personDeceData",
        },
      },
      {
        $unwind: {
          path: "$personDeceData",
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
          "personDeceData": 1,
          "personStudentData": 1
        }
      },
    ]);

    if (result.length === 0) {
      return res.status(200).send({ message: "No hay registros", data: [] });
    }

    const casos = result;

    //Encuentra todos los testTeachers relacionados con los casos
    const testStudentsCase = await TestStudent.find({ caso: { $in: casos.map((test) => test._id) }, isDeleted:false }).lean();

    const listTests = testStudentsCase.map((test) => {

      const caso = casos ? casos.find((s) => s._id.toString() === test.caso.toString()) : null;

      if (!test) return null;


      return {
        //datos del test
        id: test._id ? test._id : null,
        scoreMax: test.scoreMax ? test.scoreMax : 0,
        score: test.score ? test.score : 0,
        statusTestStudent: test.status ? test.status : false,
        scoreEvaluator: test.scoreEvaluator ? test.scoreEvaluator : 0,
        createAt: test.createdAt ? test.createdAt : null,
        //datos del estudiante
        ciStudent: caso?.personStudentData ? caso.personStudentData.CI : null,
        nameStudent: caso?.personStudentData ? caso.personStudentData.name : null,
        lastNameStudent: caso?.personStudentData ? caso?.personStudentData.lastName : null,
        //datos del DECE
        ciDece: caso?.personDeceData ? caso?.personDeceData.CI : null,
        nameDece: caso?.personDeceData ? caso?.personDeceData.name : null,
        lastNameDece: caso?.personDeceData ? caso?.personDeceData.lastName : null,
      };
    })



    // Filtrar cualquier objeto nulo que haya quedado en el array
    const filteredListTests = listTests.filter((test) => test !== null);

    res
      .status(200)
      .send({ message: "Datos obtenidos correctamente", data: filteredListTests });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error obtener el testStudent" });
  }
};

exports.deleteOne = async (req, res) => {
  try {
    const { remarks } = req.body;
    // Encuentra el objeto por su ID y actualiza el campo "isDeleted" a true
    const testStudent = await TestStudent.findByIdAndUpdate(req.params.id, { isDeleted: true, status:false }, { new: true });
    await logsAudit(req, 'DELETE', 'TestStudent', testStudent, "", remarks);

    res.status(200).send({ message: "Test Student eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error al eliminar testStudent" });
  }
};



exports.getTestStudentReport = async (req, res) => {
  try {
    // Obtener los datos necesarios para el informe desde tu base de datos
    const casoData = await obtenerDatosInforme(req.params.id);

    // Generar el contenido del informe
    const docDefinition = await generarContenidoInforme(casoData);

    // Crear el documento PDF
    const printer = new PdfPrinter({
      Roboto: {
        normal: __dirname + "/fonts/Roboto-Regular.ttf",
        bold: __dirname + "/fonts/Roboto-Bold.ttf",
        italics: __dirname + "/fonts/Roboto-Italic.ttf",
        bolditalics: __dirname + "/fonts/Roboto-BoldItalic.ttf",
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const directory = "./temp";
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const filePath = path.join(__dirname, "../../temp/informe.pdf");

    // Descargar el informe en la respuesta
    pdfDoc.pipe(fs.createWriteStream(filePath)).on("finish", () => {
      res.download(filePath, "informe.pdf", (error) => {
        // Eliminar el archivo temporal después de descargarlo
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo temporal", err);
          }
        });

        if (error) {
          console.error("Error al descargar el informe", error);
        }
      });
    });

    pdfDoc.end();

  } catch (error) {
    console.error("Error al generar el informe", error);
    res.status(500).send({ error: "Error al generar el informe" });
  }
};

exports.getTestStudent = async (req, res) => {
  try {
    const test = await TestStudent.findOne({ caso: req.params.id, isDeleted:false }).lean();
    res.status(200).send(test);
  } catch (error) {
    res.status(400).send({ error: error + "Error al encontrar testStudent" });
  }
};

exports.scoreUpdate = async (req, res) => {
  console.log(req.body);
  try {
    const { scoreEvaluator } = req.body;
    const testStudent = await TestStudent.findById(req.params.id);

    if (!testStudent) {
      return res
        .status(400)
        .send({ error: "El test no se encuentra registrado" });
    }

    if (
      (scoreEvaluator && testStudent.scoreEvaluator === 1) ||
      (!scoreEvaluator && testStudent.scoreEvaluator === 0)
    ) {
      return res
        .status(400)
        .send({ error: "No se permite modificar la puntuación del test." });
    }

    const scoreChange = scoreEvaluator ? 1 : -1;

    testStudent.score += scoreChange;
    testStudent.scoreEvaluator = scoreEvaluator ? 1 : 0;

    if (testStudent.score < 0 || testStudent.score > testStudent.scoreMax) {
      return res
        .status(400)
        .send({ error: "Error al cambiar la puntuación del test" });
    }

    const percent = calculateCsr(testStudent.score);
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

    testStudent.diagnostic = diagnostic;
    await testStudent.save();
    await logsAudit(req, 'UPDATE', 'TestStudent', testStudent, "", "Punto por observación agregado");

    res.status(200).send({ message: "Puntuación  actualizada correctamente" });
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: "Error al actualizar puntuación "  });
  }
};
