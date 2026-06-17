export function traducirCodigo(code) {
    const codigos = {
        0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
        45: "Niebla", 48: "Niebla con escarcha",
        51: "Llovizna leve", 53: "Llovizna moderada", 55: "Llovizna intensa",
        61: "Lluvia leve", 63: "Lluvia moderada", 65: "Lluvia intensa",
        71: "Nieve leve", 73: "Nieve moderada", 75: "Nieve intensa",
        80: "Chaparrones leves", 81: "Chaparrones moderados", 82: "Chaparrones intensos",
        95: "Tormenta eléctrica", 96: "Tormenta con granizo", 99: "Tormenta intensa"
    };
    return codigos[code] || "Clima variable";
}

export function iconoClima(code) {
    if (code === 0)  return "fa-sun";
    if (code <= 2)   return "fa-cloud-sun";
    if (code === 3)  return "fa-cloud";
    if (code <= 48)  return "fa-smog";
    if (code <= 55)  return "fa-cloud-rain";
    if (code <= 65)  return "fa-cloud-showers-heavy";
    if (code <= 75)  return "fa-snowflake";
    if (code <= 82)  return "fa-cloud-showers-heavy";
    if (code <= 99)  return "fa-cloud-bolt";
    return "fa-cloud";
}

export async function obtenerClima(ciudad) {
    const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Ciudad no encontrada.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const climaRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&timezone=auto`
    );
    const climaData = await climaRes.json();

    return {
        nombre: name,
        pais: country,
        current: climaData.current
    };
}