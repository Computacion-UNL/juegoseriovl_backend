const mongoose = require("mongoose");
const { Schema } = mongoose;

const CasoSchema = new Schema(
  {
    dece: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dece",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
  }
);

// Agrega el índice en el campo 'dece'
CasoSchema.index({ dece: 1 });
// Agrega el índice en el campo 'teacher'
CasoSchema.index({ teacher: 1 });
// Agrega el índice en el campo 'student'
CasoSchema.index({ student: 1 });

const Caso = mongoose.model("Caso", CasoSchema);
module.exports = Caso;
