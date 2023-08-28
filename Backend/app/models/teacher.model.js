const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
      default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);


// Agrega el índice en el campo 'dece'
TeacherSchema.index({ user: 1 });

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;

