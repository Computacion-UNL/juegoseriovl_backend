const mongoose = require('mongoose');
const { Schema } = mongoose;

const AuditSchema = new Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },
    //Se ingresa el nombre de la función que se realiza "CREATE", "UPDATE", "DELETE"
    action: {
        type:String,
        required: true
    },
    // Se ingresa el nombre de la colección   
    collectionName: {
        type:String,
        required: true
    },
    //Se ingresa el objeto que esta siendo alterado 
    documentId: {
        type:mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    // Ingresan los datos del body
    changedFields: [
        {
            type: String
        }
    ], 
    // Se ingresa la hora del log
    timestamp: {
      type: Date,
      default: Date.now
    },
    // Se ingresan comentarios u observaciones
    remarks: {
        type: String,
        default: ''
    }
  });
  
  const Audit = mongoose.model('Audit', AuditSchema);
  module.exports = Audit;