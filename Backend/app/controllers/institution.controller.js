const Institution = require("../models/institution.model.js");
const Caso = require("../models/caso.model.js");
const { logsAudit } = require('../utils/helpers/auditEvent.js');

// Create and Save a new institution
exports.createInstitution = async (req, res) => {
  console.log("Llegue con:", req.body);
  try {
    //desestructuramos el body
    const {
      nameInstitution,
      addressInstitution,
      typeInstitution,
      stateInstitution,
      cityInstitution,
      phoneInstitution,
      emailInstitution,
    } = req.body;
    const institution = new Institution({
      nameInstitution,
      addressInstitution,
      typeInstitution,
      stateInstitution,
      cityInstitution,
      phoneInstitution,
      emailInstitution,
    });
    await institution.save();
    res.status(201).send({ message: "Institution creada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al crear la institución");
  }
};

// Retrieve and return all institutions from the database.
exports.getInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find();
    res
      .status(200)
      .send({ message: "Datos obtenidos correctamente", data: institutions });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener las instituciones" });
  }
};

// Find a single institution with a institutionId
exports.getInstitution = async (req, res) => {
  try {
    //Desestructuramos el params
    const { id } = req.params;
    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(400).send({ error: "Institution not found" });
    }
    res
      .status(200)
      .send({ message: "Datos obtenidos correctamente", data: institution });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener la institucion" });
  }
};

// Update a institution identified by the institutionId in the request
exports.updateInstitution = async (req, res) => {
  try {
    const institution = await Institution.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!institution) {
      return res.status(400).send({ error: "Institution not found" });
    }
    res.status(200).send({ message: "Institución actualizada correctamente" });
  } catch (error) {
    res.status(400).send({ error: "Error al actualizar la institución" });
  }
};

// Delete a institution with the specified institutionId in the request
exports.deleteInstitution = async (req, res) => {
  console.log(req.params.id);
  try {
    const institution = await Institution.findById(req.params.id);

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
          as: "personData",
        },
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
        $match: {
          "institutionData.nameInstitution": institution.nameInstitution,
        },
      },
    ]);


    if (caso.length > 0) {
      return res
        .status(400)
        .send({ error: `La institución tiene ${caso.length} casos asociados` });
    }

    if (!institution) {
      return res.status(400).send({ error: "Institution not found" });
    }
    institution.remove();

    res.status(200).send({
      message: "Institución eliminada correctamente",
      data: institution,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Error al eliminar la institución" });
  }
};
