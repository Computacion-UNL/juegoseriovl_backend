const Person = require("../models/person.model");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Teacher = require("../models/teacher.model");
const Dece = require("../models/dece.model");
const Institution = require("../models/institution.model");
const { logsAudit } = require('../utils/helpers/auditEvent.js');

//método para crear una persona en la base de datos
exports.createPerson = async (req, res) => {
  console.log(req.body);
  try {
    const { name, lastName, age, address, phone, email, CI, nameInstitution } =
      req.body;

    let person = null;

    const institution = Institution.find({ nameInstitution }).lean();

    if (institution === null) {
      person = new Person({ name, lastName, age, address, phone, email, CI });
    } else {
      person = new Person({
        name,
        lastName,
        age,
        address,
        phone,
        email,
        CI,
        institution: institution._id,
      });
    }
    await person.save();
    console.log("Persona creada con éxito");
    res.status(201).send({ message: "Persona creada con éxito", person });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: error + "Error al crear la persona" });
  }
};

//método para obtener todas las personas de la base de datos
exports.getPersons = async (req, res) => {
  try {
    const persons = await Person.find()
      .populate("institution", "-_id nameInstitution")
      .lean();

    const personIds = persons.map((person) => person._id);
    const [users, students] = await Promise.all([
      User.find({ person: { $in: personIds } }).lean(),
      Student.find({ person: { $in: personIds } }).lean(),
    ]);

    const userMap = {};
    const studentMap = {};

    users.forEach((user) => {
      if (user.person) {
        userMap[user.person.toString()] = user;
      }
    });

    students.forEach((student) => {
      if (student.person) {
        studentMap[student.person.toString()] = student;
      }
    });

    // Construye la lista de personas con los datos relacionados
    const listaPerson = persons.map((person) => {
      const user = userMap[person._id.toString()];
      const student = studentMap[person._id.toString()];
      const rol = user ? user.role : student ? "STUDENT" : "";

      const institutionName = person.institution?.nameInstitution || '';

      return {
        id: person._id,
        institution: institutionName,
        name: person.name,
        lastName: person.lastName,
        age: person.age,
        address: person.address,
        phone: person.phone,
        email: person.email,
        CI: person.CI,
        rol: rol,
      };
    });
    res.status(200).send(listaPerson);
  } catch (error) {
    console.log(error);
    res.status(400).send(error + "Error al obtener las personas");
  }
};

//método para obtener una persona de la base de datos
exports.getPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);
    res.status(200).send(person);
  } catch (error) {
    res.status(400).send(error + "Error al obtener la persona");
  }
};

//método para actualizar una persona de la base de datos
exports.updatePerson = async (req, res) => {
  console.log("Llegue a person...");
  console.log(req.body);
  try {
    const { name, lastName, age, address, phone, email, CI } = req.body;
    const person = {
      name,
      lastName,
      age,
      address,
      phone,
      email,
      CI,
    };

    const personUpdate = await Person.findByIdAndUpdate(req.params.id, person, {
      new: true,
    });
    res
      .status(200)
      .send({ message: "Persona actualizada con éxito", personUpdate });
  } catch (error) {
    res.status(400).send(error + "Error al actualizar la persona");
  }
};

//método para eliminar una persona de la base de datos
exports.deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findOneAndRemove({ _id: id });
    const teacher = await Teacher.findOneAndRemove({ person: id });
    const dece = await Dece.findOneAndRemove({ person: id });
    const student = await Student.findOneAndRemove({ person: id });
    const user = await User.findOneAndRemove({ person: id });
    res.status(200).send(person);
  } catch (error) {
    console.log(error);
    res.status(400).send(error + ": Error al eliminar la persona");
  }
};
