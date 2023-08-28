const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //la imagen llega  test_casa1.jpg ahora saco la palabra antes de _ para conocer la
    console.log("entro el archivo al multer");
    const name = file.originalname.split("_")[0];
    console.log(name);
    if (name === "TestImagenes") {
      cb(null, "./public/TestImagenes/");
    } else if (name === "Contenido") {
      cb(null, "./public/Contenido/");
    } else if (name === "Otro") {
      cb(null, "./public/Otro/");
    }
  },
  // la imagen se guardara con el nombre despues de el _
  filename: (req, file, cb) => {

    const name = file.originalname.split("_")[1];
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = { upload };
