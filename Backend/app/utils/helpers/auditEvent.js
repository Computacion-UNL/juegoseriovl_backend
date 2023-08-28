const Audit = require('../../models/audit.model.js');

// Definición de la función de auditoría
const logsAudit = async (req, action, collectionName, documentId, changedFields, remarks) => {
  const auditRecord = new Audit({
    user:req.currentUser,
    action,
    collectionName,
    documentId,
    changedFields,
    remarks 
  });
  await auditRecord.save();
}

// Exportar la función para que pueda ser utilizada en otros archivos
module.exports = { logsAudit };