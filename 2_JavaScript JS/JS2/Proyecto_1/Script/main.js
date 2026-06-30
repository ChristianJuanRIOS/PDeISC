import { agregarBotonEliminar } from "./eliminar.js";
import { animarAgregar } from "./animacion.js";

let numeros = [];
let timeoutMensaje;

function mostrarMensaje(texto, tipo = "ok") {
  const mensaje = document.getElementById("mensaje");
  clearTimeout(timeoutMensaje);
  mensaje.textContent = texto;
  mensaje.className = tipo;
  timeoutMensaje = setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "";
  }, 1500);
}

export function agregar() {
  const input = document.getElementById("numero");
  const valor = input.value;

  if (valor === "") {
    mostrarMensaje("Debe ingresar un número", "error");
    return;
  }
  if (numeros.length >= 20) {
    mostrarMensaje("Máximo 20 números alcanzado", "error");
    return;
  }

  numeros.push(Number(valor));

  const li = document.createElement("li");
  li.textContent = valor;
  agregarBotonEliminar(li, Number(valor), numeros);
  animarAgregar(li);
  document.getElementById("lista").appendChild(li);

  document.getElementById("contador").textContent = numeros.length + " / 20";

  mostrarMensaje("Número agregado correctamente", "ok");
  input.value = "";
}

export function guardar() {
  if (numeros.length < 10) {
    mostrarMensaje("Debe ingresar al menos 10 números", "error");
    return;
  }

  fetch("/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numeros })
  })
  .then(res => res.text())
  .then(data => mostrarMensaje(data, "ok"))
  .catch(() => mostrarMensaje("Error al guardar archivo", "error"));
}

window.agregar = agregar;
window.guardar = guardar;