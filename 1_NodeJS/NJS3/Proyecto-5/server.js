import express from "express";
import path from "path";
import { fileURLToPath } from "url";


const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(__dirname));


app.get("/", (req, res) => {
  res.redirect("/inner");
});


app.get("/inner", (req, res) => {
  res.sendFile(path.join(__dirname, "Pages/pageInner.html"));
});


app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});