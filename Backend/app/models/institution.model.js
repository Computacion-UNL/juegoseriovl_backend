const mongoose = require("mongoose");
const { Schema } = mongoose;

const InstitutionSchema = new Schema(
  {
    nameInstitution: {
      type: String,
      required: true,
    },
    addressInstitution: {
      type: String,
      required: true,
    },
    typeInstitution: {
      type: String,
      enum: ["PUBLIC", "PRIVATE", "OTHER"],
      required: true,
    },
    stateInstitution: {
      type: String,
      required: true,
    },
    cityInstitution: {
      type: String,
      required: true,
    },
    phoneInstitution: {
      type: String,
      required: true,
    },
    emailInstitution: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Institution = mongoose.model("Institution", InstitutionSchema);
module.exports = Institution;
