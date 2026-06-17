import { promedio, mayor, menor } from '/Modules/estadisticas.js';
import { validarTresNumeros } from '/Modules/validaciones.js';

function calcular() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    const c = document.getElementById("c").value;

    const boxPromedio = document.getElementById("resultado-promedio");
    const boxMayor = document.getElementById("resultado-mayor");
    const boxMenor = document.getElementById("resultado-menor");

    const validacion = validarTresNumeros(a, b, c);
    if (!validacion.valido) {
        boxPromedio.classList.remove("hidden");
        boxPromedio.classList.add("error-box");
        boxMayor.classList.add("hidden");
        boxMenor.classList.add("hidden");
        document.getElementById("texto-promedio").innerText = validacion.mensaje;
        document.querySelector("#resultado-promedio .resultado-icon").className = "fa-solid fa-triangle-exclamation resultado-icon";
        document.querySelector("#resultado-promedio .resultado-ciudad").innerText = "Error";
        return;
    }

    // Limpiar error si había
    boxPromedio.classList.remove("error-box");
    document.querySelector("#resultado-promedio .resultado-icon").className = "fa-solid fa-equals resultado-icon";
    document.querySelector("#resultado-promedio .resultado-ciudad").innerText = "Promedio";

    document.getElementById("texto-promedio").innerText = promedio(a, b, c);
    document.getElementById("texto-mayor").innerText = mayor(a, b, c);
    document.getElementById("texto-menor").innerText = menor(a, b, c);

    boxPromedio.classList.remove("hidden");
    boxMayor.classList.remove("hidden");
    boxMenor.classList.remove("hidden");
}

window.calcular = calcular;