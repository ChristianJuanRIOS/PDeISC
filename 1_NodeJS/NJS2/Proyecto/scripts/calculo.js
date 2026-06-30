import { sumar, restar } from '/Modules/calculo.js';
import { validarDosNumeros } from '/Modules/validaciones.js';

function calcularSuma() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;

    const validacion = validarDosNumeros(a, b);
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }

    mostrarResultado(sumar(a, b));
}

function calcularResta() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;

    const validacion = validarDosNumeros(a, b);
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }

    mostrarResultado(restar(a, b));
}

function mostrarResultado(valor) {
    const box = document.getElementById("resultado-box");
    box.classList.remove("hidden", "error-box");
    document.getElementById("resultado").innerText = valor;
    document.querySelector("#resultado-box .resultado-icon").className = "fa-solid fa-equals resultado-icon";
    document.querySelector("#resultado-box .resultado-ciudad").innerText = "Resultado";
}

function mostrarError(mensaje) {
    const box = document.getElementById("resultado-box");
    box.classList.remove("hidden");
    box.classList.add("error-box");
    document.getElementById("resultado").innerText = mensaje;
    document.querySelector("#resultado-box .resultado-icon").className = "fa-solid fa-triangle-exclamation resultado-icon";
    document.querySelector("#resultado-box .resultado-ciudad").innerText = "Error";
}

window.calcularSuma = calcularSuma;
window.calcularResta = calcularResta;