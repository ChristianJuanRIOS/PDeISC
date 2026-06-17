import * as ArrayUtils from './arrayUtils.js';

export function validarParentesis(texto) {
  const chars = texto.split('');
  let profundidad = 0;

  ArrayUtils.recorrerChars(chars, (c) => {
    if (c === '(') profundidad++;
    if (c === ')') profundidad--;
  });

  if (profundidad !== 0) {
    return { valido: false, error: 'Los paréntesis no están balanceados.' };
  }

  let nivel = 0;
  let anidados = false;
  ArrayUtils.recorrerChars(chars, (c) => {
    if (c === '(') { nivel++; if (nivel > 1) anidados = true; }
    if (c === ')') nivel--;
  });

  if (anidados) {
    return { valido: false, error: 'El mensaje tiene paréntesis anidados, lo cual no es válido.' };
  }

  return { valido: true };
}

export function decodificar(texto) {
  const pasos = [];
  const fragmentosCifrados = [];

  const chars = texto.split('');
  if (!ArrayUtils.estaCifrado(chars)) {
    pasos.push({
      descripcion: 'Sin paréntesis detectados',
      detalle: 'El mensaje no contiene fragmentos cifrados. Se devuelve tal cual.',
    });
    return { resultado: texto, pasos, fragmentosCifrados };
  }

  pasos.push({ descripcion: 'Mensaje recibido', detalle: texto });

  const segmentosFinal = [];
  let buffer = [];
  let dentroParen = false;
  let posFragmento = 0;
  let fragmentoIdx = 0;

  ArrayUtils.recorrerChars(chars, (c, i) => {
    if (c === '(') {
      if (buffer.length > 0) {
        ArrayUtils.acumularSegmentos(segmentosFinal, ArrayUtils.unirSegmentos(buffer));
        buffer = [];
      }
      dentroParen = true;
      posFragmento = i;
      return;
    }

    if (c === ')') {
      fragmentoIdx++;
      const cifrado = ArrayUtils.unirSegmentos(buffer);
      const textoInvertido = ArrayUtils.unirSegmentos(ArrayUtils.invertirFragmento(buffer));

      fragmentosCifrados.push({
        posicion: posFragmento,
        cifrado: `(${cifrado})`,
        decodificado: textoInvertido,
      });

      pasos.push({
        descripcion: `Fragmento ${fragmentoIdx} decodificado`,
        detalle: `"(${cifrado})" → invertido → "${textoInvertido}"`,
      });

      ArrayUtils.acumularSegmentos(segmentosFinal, textoInvertido);
      buffer = [];
      dentroParen = false;
      return;
    }

    buffer.push(c);
  });

  if (buffer.length > 0) {
    ArrayUtils.acumularSegmentos(segmentosFinal, ArrayUtils.unirSegmentos(buffer));
  }

  const segmentosLimpios = segmentosFinal.filter(s => s !== undefined && s !== null);
  const longitudes = segmentosLimpios.map(s => s.length);
  const fragmentosOrdenados = ArrayUtils.ordenarPorPosicion(fragmentosCifrados);
  const fragmentosPreview = fragmentosOrdenados.slice(0, 3);

  const residuos = segmentosLimpios.filter(s => s.includes('(') || s.includes(')'));
  if (residuos.length > 0) {
    ArrayUtils.eliminarRango(segmentosLimpios, segmentosLimpios.indexOf(residuos[0]), 1);
  }

  const resumen = `Total chars entrada: ${chars.length} | Fragmentos cifrados: ${fragmentosCifrados.length}`;
  const pasosDiagnostico = [];
  ArrayUtils.prependChar(pasosDiagnostico, { descripcion: 'Resumen', detalle: resumen });
  pasos.unshift(ArrayUtils.extraerPrimero(pasosDiagnostico));

  const resultado = ArrayUtils.unirSegmentos(segmentosLimpios);
  pasos.push({ descripcion: 'Mensaje decodificado', detalle: resultado });

  return { resultado, pasos, fragmentosCifrados: fragmentosOrdenados, longitudes, fragmentosPreview };
}