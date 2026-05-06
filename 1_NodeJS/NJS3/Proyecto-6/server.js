import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./Scripts/routes.js";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/styles", express.static(path.join(__dirname, "Styles")));


app.use("/scripts", express.static(path.join(__dirname, "Scripts")));


app.use("/", express.static(path.join(__dirname, "Pages")));


app.use("/", router);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});