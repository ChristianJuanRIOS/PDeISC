import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { guardarArchivo } from "./Modulos/fileManager.js";


const app = express();


// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());


// Servir carpetas
app.use(express.static(path.join(__dirname, "Pages")));
app.use("/script", express.static(path.join(__dirname, "Script")));
app.use("/styles", express.static(path.join(__dirname, "Styles")));


// Endpoint
app.post("/guardar", (req, res) => {
  const { numeros } = req.body;

  
  if (!numeros || numeros.length < 10 || numeros.length > 20) {
    return res.status(400).send("Cantidad inválida");
  }


  const contenido = numeros.map(n => n.toString()).join("\n");


  guardarArchivo("numeros.txt", contenido);


  res.send("Archivo guardado correctamente");
});


app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});