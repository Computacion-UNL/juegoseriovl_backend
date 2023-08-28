const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const CasoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urlFile: {
      type: String,
      required: true,
    },
    idioma: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

CasoSchema.plugin(mongoosePaginate);

const Caso = mongoose.model("Caso", CasoSchema);
module.exports = Caso;
