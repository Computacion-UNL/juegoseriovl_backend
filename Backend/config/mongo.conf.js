const mongoose = require("mongoose");
require('dotenv').config();

const dbConnection = async () => {
    try {
        mongoose.set("strictQuery", false);
       await mongoose.connect(process.env.DATABASE, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true
    });
    console.log('Conexión a la base de datos principal establecida');
  } catch (error) {
    console.error('Error al conectar a la base de datos principal:', error);
  }
};
//Conexion  de la base de datos secundaria 
const dbConnection2 = async () => {
    try {
        mongoose.set("strictQuery", false);
        const secondaryConnection = await mongoose.createConnection( 
            (process.env.DATABASE_LOCAL), {
             useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true
    });
    console.log('Conexión a la base de datos secundaria establecida');
    return secondaryConnection;
  } catch (error) {
    console.error('Error al conectar a la base de datos secundaria:', error);
  }
};

module.exports = { dbConnection, dbConnection2 };
