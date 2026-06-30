export function acumularSegmentos(segmentos, nuevoSegmento) {
  segmentos.push(nuevoSegmento);
  return segmentos;
}

export function sacarUltimoSegmento(segmentos) {
  return segmentos.pop();
}

export function prependChar(buffer, char) {
  buffer.unshift(char);
  return buffer;
}

export function extraerPrimero(buffer) {
  return buffer.shift();
}

export function eliminarRango(arr, inicio, cantidad) {
  arr.splice(inicio, cantidad);
  return arr;
}

export function extraerPorcion(arr, inicio, fin) {
  return arr.slice(inicio, fin);
}

export function buscarApertura(chars) {
  return chars.indexOf('(');
}

export function estaCifrado(chars) {
  return chars.includes('(') || chars.includes(')');
}

export function recorrerChars(chars, callback) {
  chars.forEach(callback);
}

export function transformarSegmentos(segmentos, fn) {
  return segmentos.map(fn);
}

export function filtrarParentesis(chars) {
  return chars.filter(c => c !== '(' && c !== ')');
}

export function unirSegmentos(segmentos) {
  return segmentos.reduce((acc, seg) => acc + seg, '');
}

export function ordenarPorPosicion(segmentos) {
  return [...segmentos].sort((a, b) => a.posicion - b.posicion);
}

export function invertirFragmento(chars) {
  return [...chars].reverse();
}