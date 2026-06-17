// Recibe el texto crudo del archivo .txt y devuelve dos arrays separados
export function filtrarNumeros(texto) {

  
  // Divide por saltos de línea, elimina espacios extremos y descarta líneas vacías
  const lineas = texto.split("\n").map(l => l.trim()).filter(l => l !== "");
  const utiles = [];
  const noUtiles = [];

  
  for (const linea of lineas) {
    // Se quita el signo "-" para que números negativos como -121 comparen "1" con "1"
    const num = linea.replace("-", "");
    const primero = num[0];
    const ultimo = num[num.length - 1];


    if (primero === ultimo) {
      utiles.push(Number(linea)); // Convierte a número para ordenar correctamente después
    } else {
      noUtiles.push(Number(linea));
    }
  }


  utiles.sort((a, b) => a - b); // Orden numérico ascendente (sin esto "10" > "9" como string)


  return { utiles, noUtiles };
}


// Separada de mostrarResultados() para poder reutilizarse o testearse de forma independiente
export function calcularPorcentaje(utiles, total) {
  if (total === 0) return "0%";
  return ((utiles / total) * 100).toFixed(1) + "%";
}