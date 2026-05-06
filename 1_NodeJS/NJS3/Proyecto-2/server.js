import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(__dirname));

// rutas principales
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/index.html"));
});


app.get("/page1", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/page1.html"));
});


app.get("/page2", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/page2.html"));
});


app.get("/page3", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/page3.html"));
});


app.get("/page4", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/page4.html"));
});


app.get("/page5", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/page5.html"));
});


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});