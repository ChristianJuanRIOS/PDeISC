import express from "express";
import path from "path";
import { fileURLToPath } from "url";


// Esto es necesario porque con ES Modules no existen __filename ni __dirname solos,
// hay que construirlos a mano a partir de la URL del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;


// Le decimos a Express qué carpetas puede servir directamente al navegador
// Sin esto, el browser no podría cargar los JS, CSS ni HTML de esas rutas
app.use("/Scripts", express.static(path.join(__dirname, "Scripts")));
app.use("/Modulos", express.static(path.join(__dirname, "Modulos")));
app.use("/Styles", express.static(path.join(__dirname, "Styles")));
app.use("/Pages", express.static(path.join(__dirname, "Pages")));


// Cuando alguien entra a la raíz del sitio, le mandamos el index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Pages", "index.html"));
});


// Arrancamos el servidor y avisamos en consola que está corriendo
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});