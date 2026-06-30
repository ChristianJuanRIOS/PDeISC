// Limpia todos los mensajes de error y marcas visuales de los inputs
export function limpiarErrores() {
  document.querySelectorAll('.error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('input,select').forEach(e => e.classList.remove('invalid'));
}

// Marca un campo puntual como inválido y muestra su mensaje de error
export function marcarError(idCampo, idError) {
  document.getElementById(idCampo).classList.add('invalid');
  document.getElementById(idError).classList.add('show');
}

// Valida el objeto de datos leído del formulario.
// Devuelve true/false y va marcando cada campo inválido en el DOM.
export function validarFormulario(datos) {
  let valido = true;

  if (!datos.nombre || datos.nombre.trim().length < 2 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(datos.nombre)) {
    marcarError('nombre', 'err-nombre');
    valido = false;
  }

  const edadNum = Number(datos.edad);
  if (datos.edad === '' || isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
    marcarError('edad', 'err-edad');
    valido = false;
  }

  if (!datos.pais || datos.pais.trim().length < 2 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(datos.pais)) {
  marcarError('pais', 'err-pais');
  valido = false;
  }

  if (!/^[^\s@]+@gmail\.com$/.test(datos.email || '')) {
  marcarError('email', 'err-email');
  valido = false;
  }

  if (!datos.rol) {
    marcarError('rol', 'err-rol');
    valido = false;
  }

  return valido;
}
