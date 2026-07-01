/** Valida que una cadena contenga solo letras, espacios, acentos y ñ.
 * @param {string} valor 
 * @param {number} minLongitud 
 * @returns {boolean}
 */
export function validarSoloTexto(valor, minLongitud = 2) {
  const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  return valor.length >= minLongitud && regex.test(valor);
}

/**
 * Valida que una cadena contenga solo números enteros, dentro de un rango
 * de longitud (cantidad de dígitos).
 * @param {string} valor 
 * @param {number} minLongitud 
 * @param {number} maxLongitud 
 * @returns {boolean}
 */
export function validarSoloNumeros(valor, minLongitud = 1, maxLongitud = Infinity) {
  const regex = /^\d+$/;
  return valor.length >= minLongitud && valor.length <= maxLongitud && regex.test(valor);
}

/**
 * Valida que un valor sea un número entero puro (sin texto pegado, ej. "30abc")
 * y que esté dentro de un rango específico.
 * @param {string} valor 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function validarRangoNumero(valor, min, max) {
  if (valor === '') return false;
  // /^\d+$/ exige que el string sea SOLO dígitos de punta a punta,
  // a diferencia de parseInt() que corta en el primer carácter no numérico
  // y aceptaría cosas como "30años" como si fuera 30.
  if (!/^\d+$/.test(valor)) return false;
  const num = parseInt(valor, 10);
  return num >= min && num <= max;
}

/**
 * Valida que una fecha no sea mayor a hoy.
 * @param {string} valor 
 * @returns {boolean}
 */
export function validarFechaNoFutura(valor) {
  if (valor === '') return false;
  const fechaIngresada = new Date(valor);
  const hoy = new Date();
  // Quitamos las horas para comparar solo días
  hoy.setHours(0, 0, 0, 0);
  return fechaIngresada <= hoy;
}

/**
 * Valida que el formato de un email sea correcto.
 * @param {string} valor 
 * @returns {boolean}
 */
export function validarCorreo(valor) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(valor);
}

/**
 * Valida que un teléfono contenga solo números, espacios, guiones o paréntesis,
 * y que tenga al menos 7 dígitos reales (no solo separadores).
 * @param {string} valor 
 * @returns {boolean}
 */
export function validarTelefono(valor) {
  const regexFormato = /^[\d\s\-\(\)\+]+$/;
  const cantidadDigitos = (valor.match(/\d/g) || []).length;
  return valor.length >= 7 && regexFormato.test(valor) && cantidadDigitos >= 7;
}

/**
 * Valida simplemente que el texto tenga una longitud mínima.
 * @param {string} valor 
 * @param {number} min 
 * @returns {boolean}
 */
export function validarLongitudMinima(valor, min) {
  return valor.length >= min;
}

/**
 * VALIDACIÓN CRUZADA: Calcula la edad real basada en la fecha de nacimiento
 * y la compara con la edad ingresada manualmente.
 * @param {string} fechaStr - Valor del campo fechaNac
 * @param {string} edadStr - Valor del campo edad
 * @returns {boolean}
 */
export function validarEdadSegunFecha(fechaStr, edadStr) {
  if (fechaStr === '' || edadStr === '') return true; // Si falta uno, no valida la coincidencia aún

  const hoy = new Date();
  const nacimiento = new Date(fechaStr);
  let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMeses = hoy.getMonth() - nacimiento.getMonth();
  
  // Si aún no ha cumplido años este año, restamos 1
  if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nacimiento.getDate())) {
    edadCalculada--;
  }

  return parseInt(edadStr) === edadCalculada;
}


// ==========================================
// MAPEO DE VALIDACIONES POR CAMPO (SIN SWITCH)
// ==========================================
// Cada key es el ID del input. El valor es una función que recibe el valor del input
// y un objeto 'deps' (dependencias) con los valores de otros campos si se necesitan.

const reglasDeValidacion = {
  nombre: (val) => validarSoloTexto(val, 2),
  apellido: (val) => validarSoloTexto(val, 2),
  
  edad: (val, deps) => {
    if (!validarRangoNumero(val, 0, 120)) return false;
    if (deps.fechaNac) return validarEdadSegunFecha(deps.fechaNac, val);
    return true;
  },

  fechaNac: (val, deps) => {
    if (!validarFechaNoFutura(val)) return false;
    if (deps.edad) return validarEdadSegunFecha(val, deps.edad);
    return true;
  },

  sexo: (val) => val !== '',
  estadoCivil: (val) => val !== '',
  // DNI argentino real: 7 u 8 dígitos. Se deja un rango 6-8 por flexibilidad
  // con otros documentos, pero ya no acepta cadenas de longitud arbitraria.
  documento: (val) => validarSoloNumeros(val, 6, 8),
  nacionalidad: (val) => validarSoloTexto(val, 3),
  telefono: (val) => validarTelefono(val),
  mail: (val) => validarCorreo(val),
  direccion: (val) => validarLongitudMinima(val, 5),
  ocupacion: (val) => validarSoloTexto(val, 3),

  cantidadHijos: (val, deps) => {
    // Solo valida si en 'hijos' se seleccionó "Si"
    if (deps.tieneHijos === 'Si') {
      return validarRangoNumero(val, 1, 50);
    }
    return true; 
  }
};

/**
 * Valida un campo del formulario buscando su regla en el mapa.
 * @param {HTMLElement} input - El elemento del DOM
 * @param {Object} deps - Objeto con valores de otros campos necesarios (ej: { tieneHijos: 'Si', fechaNac: '1990-01-01' })
 * @returns {boolean}
 */
export function validarCampo(input, deps = {}) {
  const regla = reglasDeValidacion[input.id];
  const errorDiv = document.getElementById(`err-${input.id}`);
  
  // Si no hay regla definida para este input (ej: el select de "hijos"), lo da por válido
  if (!regla) return true;

  const valor = input.value.trim();
  const esValido = regla(valor, deps);

  // Mensajes de error dinámicos para la validación cruzada
  if ((input.id === 'edad' || input.id === 'fechaNac') && !esValido) {
    if (deps.fechaNac && deps.edad && !validarEdadSegunFecha(deps.fechaNac, deps.edad)) {
      if (errorDiv) errorDiv.textContent = "La edad no coincide con la fecha de nacimiento.";
    } else {
      // Restaura el mensaje original si falla por otra razón (ej: fecha futura)
      if (errorDiv) errorDiv.textContent = input.id === 'edad' 
        ? "Ingresa una edad válida (0-120)." 
        : "Fecha inválida o futura.";
    }
  }

  // Aplicar estilos visuales
  if (!esValido) {
    input.classList.add('invalid');
    if (errorDiv) errorDiv.classList.add('show');
  } else {
    input.classList.remove('invalid');
    if (errorDiv) errorDiv.classList.remove('show');
  }

  return esValido;
}