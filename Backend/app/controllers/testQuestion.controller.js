const TestQuestion = require('../models/testQuestion.model.js');
const { logsAudit } = require('../utils/helpers/auditEvent.js');

// Create and Save a new TestQuestion
exports.create = async (req, res) => {
    console.log(req.body)
    try {
        const { nameQuestion, descriptionQuestion, answer } = req.body;
        const testQuestion = new TestQuestion({
            nameQuestion,
            descriptionQuestion,
            answer
        });
        await testQuestion.save();
        await logsAudit(req,'CREATE', 'TestQuestion', testQuestion, Object.keys(req.body), ""); 
        res.status(201).send({ message: "Pregunta cargada al Test Docente!", testQuestion });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: error + "Error al cargar pregunta de  Test Docente" });
    }
}

// Retrieve and return all testQuestions from the database where isDelete is true.
exports.findAll = async (req, res) => {
    try {
        const testQuestions = await TestQuestion.find({ isDeleted: false });
        res.status(200).send({ message: "Preguntas cargadas con éxito", data: testQuestions });
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: "Error al cargar preguntas del Test Docente" });
    }
}


// Find a single testQuestion with a testQuestionId
exports.findOne = async (req, res) => {
    try {
        const testQuestion = await TestQuestion.findById(req.params.id);
        if (!testQuestion) {
            return res.status(400).send({ error: 'TestQuestion not found' });
        }
        res.status(200).send(testQuestion);
    } catch (error) {
        res.status(400).send({ error: error + "Error getting TestQuestion" });
    }
}

// Update a testQuestion identified by the testQuestionId in the request
exports.update = async (req, res) => {
    try {
        const { nameQuestion, descriptionQuestion, answer } = req.body;
        const testQuestion = await TestQuestion.findByIdAndUpdate(req.params.id, {
            nameQuestion,
            descriptionQuestion,
            answer
        }, { new: true });
        if (!testQuestion) {
            return res.status(400).send({ error: 'TestQuestion not found' });
        }

        await logsAudit(req,'UPDATE', 'TestQuestion', testQuestion, Object.keys(req.body), ""); 
        res.status(200).send({ message: "Pregunta del Test Docente actualizada!", testQuestion });
    } catch (error) {
        res.status(400).send({ error: error + "Error updating TestQuestion" });
    }
}
// Delete a testQuestion with the specified testQuestionId in the request (Logical Delete)
exports.delete = async (req, res) => {
    try {
        const { remarks } = req.body;
        // Encuentra el objeto por su ID y actualiza el campo "isDeleted" a true
        const testQuestion = await TestQuestion.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        await logsAudit(req, 'DELETE', 'TestQuestion', testQuestion, "", remarks); 
        
        // Verifica si el objeto se encontró y se actualizó correctamente
        if (!testQuestion) {
            return res.status(400).send({ error: 'Pregunta del test Docente no encontrada' });
        }
        
        // Cambia el código de estado HTTP si deseas reflejar que el recurso no se ha eliminado realmente, 
        // pero se ha marcado como eliminado.
        // El código 202 "Accepted" podría ser una opción.
        res.status(202).send({ message: "Pregunta del Test Docente marcada como eliminada" });
    } catch (error) {
        // Cambia el código de estado a 400 si algo sale mal.
        res.status(400).send({ error: `Error al marcar como eliminada la pregunta del Test Docente` });
    }
};

