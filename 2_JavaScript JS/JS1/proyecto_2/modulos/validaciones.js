/* ----------------------------------------------------------------
   MÓDULO DE VALIDACIONES — Proyecto 2
   Módulo ES6: cada función se exporta con "export" y se importa en
   scripts/app.js con "import". Pages/index.html carga app.js con
   <script type="module">, así que el proyecto debe servirse desde
   un servidor local (no funciona abriendo el HTML con doble clic).
   ---------------------------------------------------------------- */

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

  if (d.nombre.length < 3) { marcarError('nombre', 'err-nombre'); ok = false; }
  if (!d.categoria) { marcarError('categoria', 'err-categoria'); ok = false; }
  if (!d.marca) { marcarError('marca', 'err-marca'); ok = false; }
  if (d.precio === '' || isNaN(d.precio) || Number(d.precio) < 0) { marcarError('precio', 'err-precio'); ok = false; }
  if (d.stock === '' || isNaN(d.stock) || Number(d.stock) < 0) { marcarError('stock', 'err-stock'); ok = false; }
  if (!d.color) { marcarError('color', 'err-color'); ok = false; }
  if (!d.unidad) { marcarError('unidad', 'err-unidad'); ok = false; }
  if (!d.fecha || new Date(d.fecha) > new Date()) { marcarError('fecha', 'err-fecha'); ok = false; }
  if (d.descripcion.length < 5) { marcarError('descripcion', 'err-descripcion'); ok = false; }

  return ok;
}
