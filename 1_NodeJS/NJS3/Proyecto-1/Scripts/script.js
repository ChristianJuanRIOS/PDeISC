import {
  agregarH1,
  cambiarTexto,
  cambiarColor,
  agregarImagen,
  cambiarImagen,
  cambiarTamano
} from "../js/funciones.js";


// eventos
document.getElementById("btn-h1").addEventListener("click", agregarH1);
document.getElementById("btn-texto").addEventListener("click", cambiarTexto);
document.getElementById("btn-color").addEventListener("click", cambiarColor);
document.getElementById("btn-img").addEventListener("click", agregarImagen);
document.getElementById("btn-cambiar-img").addEventListener("click", cambiarImagen);
document.getElementById("btn-tamano").addEventListener("click", cambiarTamano);