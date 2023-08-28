const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    //haremos un person con referencia apersona
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    passwordTemporaly: {
        type: String,
        default: null
    },
    passwordTemporalyExpiration: {
        type: Date,
        default: null
    },
    grade: {
        type: String,
        required: true
    },
    parallel: {
        type: String,
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
StudentSchema.index({ person: 1 });

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;