const mongoose = require('mongoose');
const { Schema } = mongoose;


const PersonSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            default: 0
        },
        gender:{
            type: String,
            maxlength: 1, // Especifica la longitud máxima del campo
            default: "O"
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        CI: {
            type: String,
            required: true,
            unique: true
        },
        institution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institution'
        }
    },
    {

        versionKey: false,
        timestamps: true
    }
);

const Person = mongoose.model('Person', PersonSchema);
module.exports = Person;
