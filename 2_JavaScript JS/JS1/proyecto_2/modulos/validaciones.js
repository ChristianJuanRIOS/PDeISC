// Limpia todos los mensajes de error y marcas visuales de los inputs
export function limpiarErrores() {
  document.querySelectorAll('.error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('input,select,textarea').forEach(e => e.classList.remove('invalid'));
}

// Marca un campo puntual como inválido y muestra su mensaje de error
export function marcarError(idCampo, idError) {
  document.getElementById(idCampo).classList.add('invalid');
  document.getElementById(idError).classList.add('show');
}

// Valida los 9 campos del producto. Devuelve true/false.
export function validar(d) {
  let ok = true;

  // Nombre: mínimo 3 caracteres, sin dejar pasar solo espacios
  if (!d.nombre || d.nombre.trim().length < 3) {
    marcarError('nombre', 'err-nombre');
    ok = false;
  }

  // Categoría: debe estar seleccionada
  if (!d.categoria) {
    marcarError('categoria', 'err-categoria');
    ok = false;
  }

  // Marca: mínimo 2 caracteres, sin dejar pasar solo espacios
  if (!d.marca || d.marca.trim().length < 2) {
    marcarError('marca', 'err-marca');
    ok = false;
  }

  // Precio: número válido, no negativo (0 es válido, ej. producto de regalo)
  if (d.precio === '' || isNaN(d.precio) || Number(d.precio) < 0) {
    marcarError('precio', 'err-precio');
    ok = false;
  }

  // Stock: número entero, no negativo (no tiene sentido stock decimal)
  if (
    d.stock === '' ||
    isNaN(d.stock) ||
    Number(d.stock) < 0 ||
    !Number.isInteger(Number(d.stock))
  ) {
    marcarError('stock', 'err-stock');
    ok = false;
  }

  // Color: no vacío
  if (!d.color || d.color.trim().length < 2) {
    marcarError('color', 'err-color');
    ok = false;
  }

  // Unidad: debe estar seleccionada
  if (!d.unidad) {
    marcarError('unidad', 'err-unidad');
    ok = false;
  }

  // Fecha: debe existir, ser una fecha real (no un string inválido) y no ser futura
  const fechaEsValida = d.fecha && !isNaN(new Date(d.fecha).getTime());
  if (!fechaEsValida || new Date(d.fecha) > new Date()) {
    marcarError('fecha', 'err-fecha');
    ok = false;
  }

  // Descripción: mínimo 5 caracteres, sin dejar pasar solo espacios
  if (!d.descripcion || d.descripcion.trim().length < 5) {
    marcarError('descripcion', 'err-descripcion');
    ok = false;
  }

  return ok;
}