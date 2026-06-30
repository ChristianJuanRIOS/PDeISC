import { filtrarNumeros } from "/Modulos/filtrar.js";
import { mostrarResultados, mostrarMensaje } from "./ui.js";


let numerosUtiles = []; // Persiste entre lecturas para que guardar() acceda al último resultado


const uploadArea = document.getElementById("uploadArea");
const inputArchivo = document.getElementById("inputArchivo");


// Clic en el área visual dispara el input file oculto
uploadArea.addEventListener("click", () => inputArchivo.click());


// dragover: necesita preventDefault() para que "drop" funcione (comportamiento nativo bloqueado por defecto)
uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});


uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});


uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  procesarArchivo(e.dataTransfer.files[0]); // files[0]: solo se acepta un archivo
});


inputArchivo.addEventListener("change", () => {
  procesarArchivo(inputArchivo.files[0]);
});


function procesarArchivo(archivo) {
  if (!archivo || !archivo.name.endsWith(".txt")) {
    mostrarMensaje("Solo se aceptan archivos .txt", "error");
    return;
  }


  const reader = new FileReader();


  // onload es asíncrono: se ejecuta cuando el archivo termina de leerse
  reader.onload = (e) => {
    const texto = e.target.result;
    const { utiles, noUtiles } = filtrarNumeros(texto); // destructuring del objeto retornado
    numerosUtiles = utiles; // actualiza el estado global


    if (utiles.length === 0 && noUtiles.length === 0) {
      mostrarMensaje("El archivo está vacío o no tiene números válidos", "error");
      return;
    }


    mostrarResultados(utiles, noUtiles);
    mostrarMensaje(`Archivo procesado: ${utiles.length + noUtiles.length} números encontrados`, "ok");
  };

  reader.readAsText(archivo); // dispara onload cuando termina
}


function guardar() {
  if (numerosUtiles.length === 0) {
    mostrarMensaje("No hay números útiles para guardar", "error");
    return;
  }


  // POST al servidor con los números filtrados serializados como JSON
  fetch("/guardar-filtro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numeros: numerosUtiles })
  })
  .then(res => res.text())
  .then(data => mostrarMensaje(data, "ok"))
  .catch(() => mostrarMensaje("Error al guardar archivo", "error"));
}


// Los módulos ES tienen scope propio: sin esto, guardar() no es accesible desde onclick="" en el HTML
window.guardar = guardar;