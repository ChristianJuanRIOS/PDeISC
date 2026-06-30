import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.static(path.join(__dirname, "Pages")));
app.use("/script", express.static(path.join(__dirname, "Script")));
app.use("/styles", express.static(path.join(__dirname, "Styles")));
app.use("/Modulos", express.static(path.join(__dirname, "Modulos")));


app.post("/guardar-filtro", (req, res) => {
  const { numeros } = req.body;


  if (!numeros || numeros.length === 0) {
    return res.status(400).send("No hay números para guardar");
  }


  const contenido = numeros.join("\n");
  fs.writeFileSync("resultado_filtro.txt", contenido);
  res.send("Archivo guardado correctamente");
});


app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});