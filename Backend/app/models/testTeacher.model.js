const mongoose = require("mongoose");
const { Schema } = mongoose;

const TestTeacherSchema = new Schema(
  {
    caso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caso",
      required: true
    },
    scoreMax: {
      type: Number,
    },
    score: {
      type: Number,
      default: 0,
    },
    diagnostic: {
      type: String,
      default: null,
    },
    isDeleted:{
        type: Boolean,
        default:false
    },
    answers: [
      {
        refQuestion: {
          type: String,
        },
        valueAnswer: {
          type: Number,
        },
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// Agrega el índice en el campo 'caso'
TestTeacherSchema.index({ caso: 1 });

const TestTeacher = mongoose.model("TestTeacher", TestTeacherSchema);
module.exports = TestTeacher;
