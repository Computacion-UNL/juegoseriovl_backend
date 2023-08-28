const Case = require("../../models/caso.model");
const TestStudent = require("../../models/testStudent.model");
const TestTeacher = require("../../models/testTeacher.model");

// Función para obtener los datos del informe desde tu base de datos
const obtenerDatosInforme = async (id) => {
  const caso = await Case.findById(id)
    .populate({
      path: "student",
      select: "grade parallel age",
      populate: {
        path: "person",
        select: "name lastName CI email",
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
    throw new Error("Caso no encontrado");
  }

  const [testStudent, testTeacher] = await Promise.all([
    TestStudent.findOne({ caso: caso._id }),
    TestTeacher.findOne({ caso: caso._id }),
  ]);

  return {
    ciStudent: caso.student?.person?.CI || "no asignado",
    nameStudent: caso.student?.person?.name || "no asignado",
    lastNameStudent: caso.student?.person?.lastName || "no asignado",
    age: caso.student?.age || "no asignado",
    nameInstitutionStudent:
      caso.student?.person?.institution?.nameInstitution || "no asignado",
    grade: caso.student?.grade || "no asignado",
    parallel: caso.student?.parallel || "no asignado",
    nameTeacher: caso.teacher?.user?.person?.name || "no asignado",
    lastNameTeacher: caso.teacher?.user?.person?.lastName || "no asignado",
    nameDece: caso.dece?.user?.person?.name || "no asignado",
    lastNameDece: caso.dece?.user?.person?.lastName || "no asignado",
    diagnosticStudent: testStudent?.diagnostic || "no asignado",
    scoreStudent: testStudent?.score || null,
    scoreEvaluator: testStudent?.scoreEvaluator || null,
    diagnosticTeacher: testTeacher?.diagnostic || "no asignado",
    scoreTeacher: testTeacher?.score || null,
    respuestas: testStudent.answers || null,
  };
};

// Función para generar el contenido del informe con los datos obtenidos
const generarContenidoInforme = async (casoData) => {
  const content = [];

  // Título: Nombre de la Institución
  content.push({
    text: casoData.nameInstitutionStudent,
    style: "title",
    alignment: "center",
    bold: true,
    fontSize: 24,
    margin: [0, 0, 0, 20], // Margen inferior
  });

  // Subtítulo: Reporte Estudiante
  content.push({
    text: "Reporte Estudiante",
    style: "subtitle",
    alignment: "center",
    bold: true,
    fontSize: 24,
    margin: [0, 0, 0, 20], // Margen inferior
  });

  // Sección: Datos del estudiante
  content.push({
    text: "Datos del estudiante:",
    style: "section",
    margin: [0, 0, 0, 10], // Margen inferior
    decoration: "underline",
    bold: true,
    fontSize: 16,
  });

  content.push(
    { text: "Cédula:", style: "label" },
    { text: casoData.ciStudent, style: "value" },
    { text: "Nombre:", style: "label" },
    {
      text: `${casoData.nameStudent} ${casoData.lastNameStudent}`,
      style: "value",
    },
    { text: "Edad:", style: "label" },
    { text: casoData.age, style: "value" },
    { text: "Grado:", style: "label" },
    { text: casoData.grade, style: "value" },
    { text: "Paralelo:", style: "label" },
    { text: casoData.parallel, style: "value" }
  );

  // Sección: Datos del docente evaluador
  content.push({
    text: "Datos del docente evaluador:",
    style: "section",
    margin: [0, 10, 0, 10], // Margen inferior
    decoration: "underline",
    bold: true,
    fontSize: 16,
  });

  content.push(
    { text: "Nombre:", style: "label" },
    {
      text: `${casoData.nameTeacher} ${casoData.lastNameTeacher}`,
      style: "value",
    }
  );

  // Sección: Datos del evaluador
  content.push({
    text: "Datos del evaluador:",
    style: "section",
    margin: [0, 10, 0, 10], // Margen inferior
    decoration: "underline",
    bold: true,
    fontSize: 16,
  });

  content.push(
    { text: "Nombre:", style: "label" },
    { text: `${casoData.nameDece} ${casoData.lastNameDece}`, style: "value" }
  );

  // Sección: Resultados
  content.push({
    text: "Resultados:",
    style: "section",
    margin: [0, 10, 0, 10], // Margen inferior
    decoration: "underline",
    bold: true,
    fontSize: 16,
  });

  content.push(
    { text: "Puntuación del Test Docente:", style: "label" },
    { text: casoData.scoreTeacher, style: "value" },
    { text: "Diagnóstico del Test Docente:", style: "label" },
    { text: casoData.diagnosticTeacher, style: "value" },
    { text: "Puntuación del Test Estudiante:", style: "label" },
    { text: casoData.scoreStudent, style: "value" },
    { text: "Diagnóstico del Test Estudiante:", style: "label" },
    { text: casoData.diagnosticStudent, style: "value" },
    { text: "Observaciones por parte del evaluador:", style: "label" },
    {
      text:
        casoData.scoreEvaluator === 0
          ? ""
          : "Punto agregado durante el análisis",
      style: "value",
    }
  );

  // Tabla: Respuestas
  const respuestasTable = {
    style: "table",
    table: {
      widths: ["auto", "auto", "auto"],
      headerRows: 1,
      body: [
        [
          { text: "Pregunta", style: "tableHeader" },
          { text: "Nombre", style: "tableHeader" },
          { text: "Valor", style: "tableHeader" },
        ],
        ...casoData.respuestas.map((respuesta, index) => [
          { text: `Pregunta ${index + 1}`, style: "value" },
          respuesta.refImages.split("/").pop() ?? "",
          respuesta.valueAnswer ?? "",
        ]),
      ],
      alignment: "center", // Alineación centrada de la tabla
    },
    layout: {
      hLineWidth: (i, node) =>
        i === 0 || i === node.table.body.length ? 2 : 1,
      vLineWidth: () => 1,
    },
  };
  content.push(respuestasTable);

  // Definir estilos
  const styles = {
    title: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
    subtitle: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
    section: {
      fontSize: 16,
      decoration: "underline",
      bold: true,
      margin: [0, 0, 0, 10],
    },
    label: { bold: true, fontSize: 12 },
    value: { fontSize: 12 },
    table: { margin: [0, 10, 0, 10] },
    tableHeader: { bold: true, fontSize: 12 },
  };

  // Definir documento PDF
  const docDefinition = {
    content,
    styles,
  };

  return docDefinition;
};
module.exports = { obtenerDatosInforme, generarContenidoInforme };
