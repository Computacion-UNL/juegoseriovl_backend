const fs = require("fs");

function copiarArchivo(rutaArchivoOrigen, rutaArchivoDestino, callback) {
  fs.copyFile(rutaArchivoOrigen, rutaArchivoDestino, (err) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null);
  });
}

module.exports = copiarArchivo;
