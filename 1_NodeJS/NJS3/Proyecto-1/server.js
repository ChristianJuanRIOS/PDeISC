import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;


// rutas estáticas
app.use("/scripts", express.static(path.join(__dirname, "Scripts"))); // script.js
app.use("/js", express.static(path.join(__dirname, "Modulos")));      // funciones.js
app.use("/css", express.static(path.join(__dirname, "Styles")));


// ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});