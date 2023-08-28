const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const copiarArchivo = require("./utils/manageFile")

const app = express();
const copyPath = path.join(__dirname, "panel-sg/");

async function iniciarServidor() {
  try {
    // Servir archivos estáticos de Angular
    app.use(express.static(copyPath));

    // Ruta para cualquier otra solicitud
    app.get("*", (req, res) => {
      res.sendFile(path.join(copyPath, "index.html"));
    });

    // Manejo de rutas no encontradas (404)
    app.use((req, res) => {
      res.status(404).sendFile(path.join(copyPath, "404.html"));
    });

    // Puerto en el que se ejecutará el servidor
    const port = process.env.PORT || 3000;

    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor node.js en ejecución en el puerto ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
}

iniciarServidor();
