import { limpiarErrores, validarFormulario } from '../modulos/validaciones.js';

// Array en memoria que actúa como "base de datos" de usuarios
const usuarios = [];

const form = document.getElementById('userForm');
const usersGrid = document.getElementById('usersGrid');
const userCount = document.getElementById('userCount');

// ---------- Las 3 formas de leer el formulario ----------

// Método 1: acceso directo por ID, campo por campo
function leerPorId() {
  return {
    nombre: document.getElementById('nombre').value.trim(),
    edad:   document.getElementById('edad').value.trim(),
    pais:   document.getElementById('pais').value.trim(),
    email:  document.getElementById('email').value.trim(),
    rol:    document.getElementById('rol').value
  };
}

// Método 2: usando la colección "elements" del propio formulario (por atributo name)
function leerPorElements(formulario) {
  const els = formulario.elements;
  return {
    nombre: els['nombre'].value.trim(),
    edad:   els['edad'].value.trim(),
    pais:   els['pais'].value.trim(),
    email:  els['email'].value.trim(),
    rol:    els['rol'].value
  };
}

// Método 3: usando la API moderna FormData
function leerPorFormData(formulario) {
  const fd = new FormData(formulario);
  return {
    nombre: (fd.get('nombre') || '').trim(),
    edad:   (fd.get('edad') || '').trim(),
    pais:   (fd.get('pais') || '').trim(),
    email:  (fd.get('email') || '').trim(),
    rol:    fd.get('rol') || ''
  };
}

function formatear(datos) {
  return JSON.stringify(datos, null, 2);
}

// ---------- Render dinámico ----------
function renderUsuarios() {
  userCount.textContent = usuarios.length;

  if (usuarios.length === 0) {
    usersGrid.innerHTML = `<div class="empty-state">Todavía no cargaste ningún usuario.</div>`;
    return;
  }

  usersGrid.innerHTML = '';
  usuarios.forEach(u => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="name">${u.nombre}</div>
      <div class="mail">${u.email}</div>
      <div class="meta"><span>${u.pais}</span><span>${u.rol} · ${u.edad} años</span></div>
    `;
    usersGrid.appendChild(card);
  });
}

// ---------- Envío del formulario (sin recarga) ----------
form.addEventListener('submit', function (event) {
  event.preventDefault(); // clave: evita el recargo de la página

  limpiarErrores(); // función importada del módulo de validaciones

  // Usamos el método 1 como fuente de validación
  const datos = leerPorId();
  if (!validarFormulario(datos)) return; // función importada del módulo de validaciones

  // Mostramos el resultado de los 3 métodos para comprobar que son equivalentes
  document.getElementById('out-method1').textContent = formatear(leerPorId());
  document.getElementById('out-method2').textContent = formatear(leerPorElements(form));
  document.getElementById('out-method3').textContent = formatear(leerPorFormData(form));

  // Guardamos el nuevo usuario y actualizamos la interfaz dinámicamente
  usuarios.push(datos);
  renderUsuarios();

  form.reset();
  document.getElementById('nombre').focus();
});

renderUsuarios();


const toggleBtn = document.getElementById('toggle-theme');

// Al cargar la página, revisa si había una preferencia guardada
const temaGuardado = localStorage.getItem('tema');
if (temaGuardado === 'claro') {
  document.body.classList.add('light-mode');
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  // Guarda la preferencia actual
  const esClaro = document.body.classList.contains('light-mode');
  localStorage.setItem('tema', esClaro ? 'claro' : 'oscuro');
});