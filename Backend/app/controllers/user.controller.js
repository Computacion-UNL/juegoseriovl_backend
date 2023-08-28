const mongoose = require("mongoose");
const { validateIDCard, generatorPass } = require("../utils/helpers/tools.js");
const { sendRecoveryCodeEmail } = require("../../config/mail.conf");
const { logsAudit } = require('../utils/helpers/auditEvent.js');

const User = require("../models/user.model");
const Person = require("../models/person.model");
const Teacher = require("../models/teacher.model");
const Dece = require("../models/dece.model");
const Caso = require("../models/caso.model");
const { encrypt } = require("../utils/helpers/handle.password");

//método para crear un usuario en la base de datos Listo
exports.createUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //datos del nuevo usuario
    const { CI, name, lastName, address, phone, email, password } = req.body;

    //verifica la cédula
    const validateCard = await validateIDCard(CI);

    //Emite un error si la cédula es invalida
    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();
      console.log("La cédula que ingresaste es inválida");
      return res
        .status(400)
        .send({ error: "La cédula que ingresaste es inválida" });
    }
    
    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ CI }).exec();
    const isEmailNotDuplicated = await Person.findOne({ email }).exec();
    
    //si el email ya esta registrado retornamos un error
    if (isCINotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "La cédula pertenecen un usuario registrado" });
    }

    if (isEmailNotDuplicated) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .send({ error: "El correo pertenece a un usuario registrado" });
    }

    //creamos la persona
    const newPerson = await new Person({
      CI,
      name,
      lastName,
      address,
      phone,
      email,
    }).save({ session });

    //encriptamos la contraseña
    const hashedPassword = await encrypt(password);

    //creamos el usuario
    const user=await new User({
      person: newPerson._id,
      password: hashedPassword,
      role: "ADMIN",
    }).save({ session });

    await logsAudit(req, 'CREATE', 'USER', user, Object.keys(req.body), "Registro User");

    await session.commitTransaction();
    session.endSession();

    res.status(201).send({ message: "Usuario creado con éxito" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al crear el usuario" });
  }
};

//método para obtener todos los usuarios de la base de datos Listo
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("_id role status ")
      .populate("person", "-_id CI email name lastName")
      .exec();

    const userData = users.map((user) => {
      return {
        id: user._id,
        CI: user.person.CI,
        name: user.person.name,
        lastName: user.person.lastName,
        email: user.person.email,
        role: user.role,
        status: user.status,
      };
    });

    res
      .status(200)
      .send({ message: "Datos extraídos con éxito", data: userData });
  } catch (error) {
    res.status(400).send({ error: "Error al obtener los usuarios" });
  }
};

//método para obtener un usuario de la base de datos Listo
exports.getUser = async (req, res) => {
  try {
    //Desestructuramos el body
    const { id } = req.params;

    //Buscamos el usuario por id
    const user = await User.findById(id).select("_id role status").populate({
      path: "person",
      select: "_id CI email name lastName address phone ",
    });

    //Si el usuario no existe retornamos un error
    if (!user) {
      return res.status(400).send({ error: "Usuario no encontrado" });
    }
    const response = {
      id: user._id,
      role: user.role,
      status: user.status,
      ciUser: user?.person ? user.person.CI : "No asignado",
      nameUser: user?.person ? user.person.name : "No asignado",
      lastNameUser: user?.person ? user.person.lastName : "No asignado",
      addressUser: user?.person ? user.person.address : "No asignado",
      phoneUser: user?.person ? user.person.phone : "No asignado",
      emailUser: user?.person ? user.person.email : "No asignado",
    };
    //Si el usuario existe retornamos el usuario
    res.status(200).send({ message: "Usuario encontrado", data: response });
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error + "Error al obtener el usuario" });
  }
};

//método para actualizar un usuario de la base de datos
//No esta terminado
exports.updateUser = async (req, res) => {
  console.log(req.body)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //Llega el id a editar
    const { id } = req.params;
    //datos para modificar
    const { ciUser, name, lastName, address, phone, email } = req.body;

    //Busca la existencia del usuario
    const user = await User.findById(id).lean()
    //Busca la existencia de la persona vinculada al usuario
    const person = await Person.findById(user.person).lean()

    if(!user || !person){
      await session.abortTransaction();
      session.endSession();
      console.log("El usuario no existe")
      return res
        .status(400)
        .send({ error: "El usuario  no existe" });
    }

    //Verifica la validez de la cédula
    const validateCard = await validateIDCard(ciUser);

    if (!validateCard) {
      await session.abortTransaction();
      session.endSession();  
      console.log("La cédula que ingresaste es inválida");
      return res
        .status(400)
        .send({ error: "La cédula que ingresaste es inválida" });
    }

    //Verifica  si existen el CI o correo en otras cuentas
    const isCINotDuplicated = await Person.findOne({ _id: { $ne: person._id }, CI: ciUser }).exec();
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

    
    const personUpdate = await Person.findByIdAndUpdate(
      person._id,
      {
        CI: ciUser,
        name,
        lastName,
        address,
        phone,
        email,
      },
      { new: true }
    );

    await logsAudit(req, 'CREATE', 'PERSON', personUpdate, Object.keys(req.body), "Actualizar persona desde USER");
    
    await session.commitTransaction();
    session.endSession();
    res.status(200).send({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    res.status(401).send({ error: "Error al actualizar el usuario" });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    //Desestructuramos el body
    const { id, action } = req.body;

    //Actualizamos el estado del usuario
    const user = await User.findByIdAndUpdate(
      id,
      { status: action },
      { new: true }
    );

    await logsAudit(req, 'CREATE', 'USER', user, Object.keys(req.body), "Actualizar USER");
    //Si el usuario no existe retornamos un error
    if (!user) {
      return res.status(400).send({ error: "El usuario no se encuentra registrado" });
    }

    //Si el usuario existe retornamos el usuario
    const successMessage = action
      ? "Usuario activado con éxito"
      : "Usuario desactivado con éxito";

    //Retornamos el mensaje de éxito
    res.status(200).send({ message: successMessage });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "Error al actualizar el estado del usuario" });
  }
};

exports.changePasswordUser = async (req, res) => {
  try {
    //Obtenemos al id a editar
    const { id } = req.body;

    //buscamos al usuario 
    const user = await User.findById(id)
    .select("_id role status")
    .populate({
      path: "person",
      select: "_id CI email name lastName address phone ",
    });


    //Emitimos un error si no se encuentra el usuario
    if (!user) {
      console.log("Usuario no encontrado")
      return res.status(400).send({ error: "Usuario no encontrado" });
    }

    //generamos una contraseña randomInt con Mayúsculas, minúsculas y números
    const pass = generatorPass();

    //Encriptamos la contraseña
    const hashedPassword = await encrypt(pass);

    //Preparamos la información para enviar los datos al correo
    const subject = "SeriusGame - Renovación de Contraseña";
    const operation = 3;

    //Actualizamos la nueva contraseña
    user.password = hashedPassword;

    //Guardamos los cambios del usuario
    await user.save();

    await logsAudit(req, 'UPDATE', 'USER', user, Object.keys(req.body), "Actualizar  USER");
    //Enviamos el correo  con los datos 
    const result = await sendRecoveryCodeEmail(user.person.email, pass, subject, operation);
    if (result) {
      console.log(`Código enviado exitosamente`);
    } else {
      console.log(`Error al enviar el código`);
    }

    //Retornamos el mensaje de éxito
    res.status(200).send({ message: "Renovación exitosa" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "Error al actualizar el estado del usuario" });
  }
};


//método para eliminar un usuario de la base de datos
exports.deleteUser = async (req, res) => {
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Encuentra el usuario y obtén el ID de la persona asociada
    const user = await User.findById(id)
      .populate({
        path: "person",
        select: "_id CI ",
      }).session(session);

    const adminCount = await User.find({role:'ADMIN'}).session(session);
    console.log("Numero de Admins",adminCount.length)

    if(adminCount.length <2){
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "Debe por lo menos conservar un Administrador" });

    }

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ error: "Usuario no encontrado" });
    }

    //Verifica si hay docentes vinculados
    const teacherFind = await Teacher.findOne({user:user._id}).session(session);

    //Si existe un vinculo a un docente
    if(teacherFind){
        //Verifica si tiene casos asignados
        const casoCount = await Caso.countDocuments({ teacher: teacherFind._id }).session(session);
        //Si no tiene casos se elimina el docente
        if(casoCount > 0){ 
          await session.abortTransaction();
          session.endSession();
          return res
                .status(400)
                .send({ error: "El Docente tiene casos asignados" });
        }
        //Elimina el docente vinculado
        await Teacher.findByIdAndDelete(teacherFind._id).session(session);
    }


    //Verifica si hay deces vinculados
    const deceFind = await Dece.findOne({user:user._id}).session(session);

    //Si existe  un vinculo a un dece
    if(deceFind){
        //Verifica si tiene casos asignados
        const casoCount = await Caso.countDocuments({ dece: deceFind._id }).session(session);
        //Si no tiene casos asignados
        if(casoCount > 0){
          await session.abortTransaction();
          session.endSession();
          return res
                .status(400)
                .send({ error: "El Dece tiene casos asignados" }); 
        }
        //Elimina el dece vinculado
        await Dece.findByIdAndDelete(deceFind._id).session(session);
    }



    if (user.person === null) {
      await User.findByIdAndDelete(id).session(session);
      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .send({ message: "Usuario eliminado correctamente" });
    }
   
    await Person.findByIdAndDelete(user.person._id).session(session);
    const userDeleted=await User.findByIdAndDelete(id).session(session);

    await logsAudit(req, 'DELETED', 'USER', userDeleted, "", "Eliminado Físico usuario");
    await session.commitTransaction();
    session.endSession();

    res.status(200).send({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    res.status(400).send({ error: "Error al eliminar el usuario" });
  }
};
