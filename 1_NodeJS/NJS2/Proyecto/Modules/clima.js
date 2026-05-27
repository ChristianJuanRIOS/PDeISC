// Módulo de clima con simulación dinámica según ciudad


export function obtenerClima(ciudad) {


    if (!ciudad) {
        return "Ciudad no especificada";
    }


    // Normalizamos texto
    const c = ciudad.toLowerCase();


    // Climas simulados por ciudad
    if (c.includes("mar del plata")) {
        return "Parcialmente nublado con viento costero";
    }


    if (c.includes("buenos aires")) {
        return "Húmedo con probabilidad de tormentas";
    }


    if (c.includes("bariloche")) {
        return "Frío con posibilidad de nieve";
    }


    if (c.includes("salta")) {
        return "Cálido y seco";
    }

    
    if (c.includes("córdoba")) {
        return "Soleado con calor moderado";
    }


    // Caso general
    return "Clima variable con condiciones normales";
}