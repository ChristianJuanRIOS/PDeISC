import { limpiarErrores, validar } from '../modulos/validaciones.js';

let productos = []; // "let" porque el método spread reasigna la variable

const form = document.getElementById('productForm');
const tableWrap = document.getElementById('tableWrap');
const prodCount = document.getElementById('prodCount');
const arrayDump = document.getElementById('arrayDump');
const metodoSelect = document.getElementById('metodo');
const methodHint = document.getElementById('methodHint');
const posicionWrap = document.getElementById('posicionWrap');

const hints = {
  push:    'push(producto) agrega el elemento al final del array, mutándolo.',
  unshift: 'unshift(producto) agrega el elemento al inicio del array, mutándolo.',
  splice:  'splice(posicion, 0, producto) inserta el elemento en la posición indicada, mutándolo.',
  spread:  'productos = [...productos, producto] crea un array NUEVO (no muta el original), técnica típica de programación inmutable / React.'
};

  metodoSelect.addEventListener('change', () => {
  methodHint.textContent = hints[metodoSelect.value];
  posicionWrap.classList.toggle('hidden', metodoSelect.value !== 'splice');
});

function leerFormulario() {
  // Método de lectura: FormData
  const fd = new FormData(form);
  return {
    nombre: (fd.get('nombre') || '').trim(),
    categoria: fd.get('categoria') || '',
    marca: (fd.get('marca') || '').trim(),
    precio: fd.get('precio') || '',
    stock: fd.get('stock') || '',
    color: (fd.get('color') || '').trim(),
    unidad: fd.get('unidad') || '',
    fecha: fd.get('fecha') || '',
    descripcion: (fd.get('descripcion') || '').trim(),
    metodo: fd.get('metodo') || 'push',
    posicion: fd.get('posicion') || '0'
  };
}

// ---------- Los 4 métodos de almacenamiento ----------
function guardarProducto(producto, metodo, posicion) {
  switch (metodo) {
    case 'push':
      productos.push(producto);
      break;
    case 'unshift':
      productos.unshift(producto);
      break;
    case 'splice': {
      let pos = Number(posicion);
      if (isNaN(pos) || pos < 0) pos = 0;
      if (pos > productos.length) pos = productos.length;
      productos.splice(pos, 0, producto);
      break;
    }
    case 'spread':
      productos = [...productos, producto];
      break;
    default:
      productos.push(producto);
  }
}

// ---------- Render dinámico ----------
function render() {
  prodCount.textContent = productos.length + (productos.length === 1 ? ' producto' : ' productos');
  arrayDump.textContent = JSON.stringify(productos, null, 2);

  if (productos.length === 0) {
    tableWrap.innerHTML = `<div class="empty-state">Todavía no cargaste ningún producto.</div>`;
    return;
  }

  let html = `<table><thead><tr>
    <th>Producto</th><th>Categoría</th><th>Marca</th><th>Precio</th>
    <th>Stock</th><th>Color</th><th>Unidad</th><th>Ingreso</th><th></th>
  </tr></thead><tbody>`;

  productos.forEach((p, i) => {
    html += `<tr>
      <td><strong>${p.nombre}</strong><br><span style="color:var(--muted);font-size:11.5px;">${p.descripcion}</span></td>
      <td><span class="badge ${p.categoria}">${p.categoria}</span></td>
      <td>${p.marca}</td>
      <td class="price">$${Number(p.precio).toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.color}</td>
      <td>${p.unidad}</td>
      <td>${p.fecha}</td>
      <td><button type="button" class="del" data-index="${i}">Quitar</button></td>
    </tr>`;
  });

  html += '</tbody></table>';
  tableWrap.innerHTML = html;

  tableWrap.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      productos = productos.filter((_, i) => i !== idx); // otra forma inmutable de actualizar el array
      render();
    });
  });
}

// ---------- Envío del formulario (sin recarga) ----------
form.addEventListener('submit', function (event) {
  event.preventDefault();
  limpiarErrores(); // función importada del módulo de validaciones

  const datos = leerFormulario();
  if (!validar(datos)) return; // función importada del módulo de validaciones

  const producto = {
    nombre: datos.nombre, categoria: datos.categoria, marca: datos.marca,
    precio: Number(datos.precio), stock: Number(datos.stock), color: datos.color,
    unidad: datos.unidad, fecha: datos.fecha, descripcion: datos.descripcion
  };

  guardarProducto(producto, datos.metodo, datos.posicion);
  render();

  form.reset();
  metodoSelect.value = 'push';
  methodHint.textContent = hints.push;
  posicionWrap.classList.add('hidden');
  document.getElementById('nombre').focus();
});

render();


const toggleBtn = document.getElementById('toggle-theme');

// Al cargar la página, revisa si había una preferencia guardada
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'oscuro') {
  document.body.classList.add('dark-mode');
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Guarda la preferencia actual
  const esOscuro = document.body.classList.contains('dark-mode');
  localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
});