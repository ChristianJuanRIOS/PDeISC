import { obtenerClima, traducirCodigo, iconoClima } from '/Modules/clima.js';

async function consultarClima() {
    const ciudad = document.getElementById("ciudad").value.trim();
    const box    = document.getElementById("resultado-box");
    const icono  = document.getElementById("icono-resultado");

    // Campo vacío
    if (!ciudad) {
        document.getElementById("resultado-ciudad").innerText = "Campo vacío";
        document.getElementById("resultado-texto").innerText  = "Por favor ingresá el nombre de una ciudad.";
        icono.className = "fa-solid fa-triangle-exclamation resultado-icon";
        box.classList.remove("hidden");
        box.classList.add("resultado-error");
        return;
    }

    // Estado de carga
    box.classList.remove("hidden", "resultado-error");
    document.getElementById("resultado-ciudad").innerText = ciudad;
    document.getElementById("resultado-texto").innerText  = "Buscando...";
    icono.className = "fa-solid fa-spinner fa-spin resultado-icon";

    try {
        const { nombre, pais, current: c } = await obtenerClima(ciudad);

        document.getElementById("resultado-ciudad").innerText = `${nombre}, ${pais}`;
        document.getElementById("resultado-texto").innerText  =
            `${traducirCodigo(c.weathercode)} · ${c.temperature_2m}°C · Humedad: ${c.relative_humidity_2m}% · Viento: ${c.windspeed_10m} km/h`;

        icono.className = `fa-solid ${iconoClima(c.weathercode)} resultado-icon`;

    } catch (err) {
        document.getElementById("resultado-ciudad").innerText = "Ciudad no encontrada";
        document.getElementById("resultado-texto").innerText  =
            err.message === "Ciudad no encontrada."
                ? `No encontramos "${ciudad}". Revisá el nombre e intentá de nuevo.`
                : "Ocurrió un error al consultar. Intentá más tarde.";
        icono.className = "fa-solid fa-circle-xmark resultado-icon";
        box.classList.add("resultado-error");
    }
}

window.consultarClima = consultarClima;