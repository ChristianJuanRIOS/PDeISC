import express from "express";
import { procesarFormulario } from "../modules/formHandler.js";


export const router = express.Router();


router.post("/register", (req, res) => {
  const data = procesarFormulario(req.body);
  res.json(data);
});