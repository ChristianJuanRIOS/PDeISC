import { multiplicar, dividir } from '/Modules/operaciones.js';
import { validarDosNumeros } from '/Modules/validaciones.js';

function operar() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;

    const boxMulti = document.getElementById("resultado-multi");
    const boxDivi = document.getElementById("resultado-divi");

    const validacion = validarDosNumeros(a, b);
    if (!validacion.valido) {
        boxMulti.classList.remove("hidden");
        boxMulti.classList.add("error-box");
        boxDivi.classList.add("hidden");
        document.getElementById("texto-multi").innerText = validacion.mensaje;
        document.querySelector("#resultado-multi .resultado-icon").className = "fa-solid fa-triangle-exclamation resultado-icon";
        document.querySelector("#resultado-multi .resultado-ciudad").innerText = "Error";
        return;
    }

    // Limpiar error si había
    boxMulti.classList.remove("error-box");
    document.querySelector("#resultado-multi .resultado-icon").className = "fa-solid fa-xmark resultado-icon";
    document.querySelector("#resultado-multi .resultado-ciudad").innerText = "Multiplicación";

    document.getElementById("texto-multi").innerText = multiplicar(a, b);
    document.getElementById("texto-divi").innerText = dividir(a, b);

    boxMulti.classList.remove("hidden");
    boxDivi.classList.remove("hidden");
}

window.operar = operar;