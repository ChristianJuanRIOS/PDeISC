import { validarCampo } from '../modulos/validaciones.js';

// --- ELEMENTOS DEL DOM ---
const form = document.getElementById('personForm');
const personList = document.getElementById('personList');
const personCount = document.getElementById('personCount');
const globalMsg = document.getElementById('globalMsg');
const clearAllBtn = document.getElementById('clearAll');

// Selectores dinámicos
const hijosSelect = document.getElementById('hijos');
const cantidadHijosWrap = document.getElementById('cantidadHijosWrap');
const cantidadHijosInput = document.getElementById('cantidadHijos');

// Campos que necesitan validación cruzada
const edadInput = document.getElementById('edad');
const fechaNacInput = document.getElementById('fechaNac');

// Tema
const toggleTheme = document.getElementById('toggle-theme');

// Se envuelve en try/catch: si el localStorage tuviera datos corruptos
// (editados a mano, formato viejo, etc.), JSON.parse tiraría una excepción
// no controlada y rompería la carga de toda la página.
let personas = [];
try {
  personas = JSON.parse(localStorage.getItem('almacen_personas')) || [];
} catch {
  personas = [];
}

// --- FUNCIONES AUXILIARES ---

// Recolecta los valores de otros campos para pasarlos como dependencias
const obtenerDependencias = () => ({
  tieneHijos: hijosSelect.value,
  fechaNac: fechaNacInput.value,
  edad: edadInput.value
});

// --- EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
  renderList();
  aplicarTemaGuardado();
});

// Toggle dinámico de "Hijos"
hijosSelect.addEventListener('change', () => {
  if (hijosSelect.value === 'Si') {
    cantidadHijosWrap.classList.remove('hidden');
  } else {
    cantidadHijosWrap.classList.add('hidden');
    cantidadHijosInput.value = '';
  }
});

// Toggle Tema
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

function aplicarTemaGuardado() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

// Validación en tiempo real
const inputs = form.querySelectorAll('input, select');
inputs.forEach(input => {
  
  input.addEventListener('blur', () => {
    validarCampo(input, obtenerDependencias());
  });

  input.addEventListener('input', () => {
    if (input.classList.contains('invalid')) {
      validarCampo(input, obtenerDependencias());
    }

    // Si modifico la edad, re-valido la fecha para que se quite el rojo si ahora coinciden
    if (input.id === 'edad' && fechaNacInput.value !== '') {
      validarCampo(fechaNacInput, obtenerDependencias());
    }
    // Si modifico la fecha, re-valido la edad
    if (input.id === 'fechaNac' && edadInput.value !== '') {
      validarCampo(edadInput, obtenerDependencias());
    }
  });
});

// Envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  let esValido = true;
  const deps = obtenerDependencias();
  
  inputs.forEach(input => {
    if (!validarCampo(input, deps)) esValido = false;
  });

  if (!esValido) {
    mostrarMensaje('Por favor, corrige los errores marcados en rojo.', 'error');
    return;
  }

  // Crear objeto persona
  const nuevaPersona = {
    id: Date.now(),
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    edad: edadInput.value,
    fechaNac: fechaNacInput.value,
    sexo: document.getElementById('sexo').value,
    estadoCivil: document.getElementById('estadoCivil').value,
    documento: document.getElementById('documento').value.trim(),
    nacionalidad: document.getElementById('nacionalidad').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    mail: document.getElementById('mail').value.trim(),
    tieneHijos: hijosSelect.value,
    cantidadHijos: hijosSelect.value === 'Si' ? cantidadHijosInput.value : '0',
    direccion: document.getElementById('direccion').value.trim(),
    ocupacion: document.getElementById('ocupacion').value.trim()
  };

  personas.push(nuevaPersona);
  guardarEnStorage();
  renderList();
  form.reset();
  cantidadHijosWrap.classList.add('hidden');
  
  mostrarMensaje(`¡${nuevaPersona.nombre} ${nuevaPersona.apellido} guardado correctamente!`, 'success');
});

// Limpiar todo el almacenamiento
clearAllBtn.addEventListener('click', () => {
  if (personas.length === 0) return;
  personas = [];
  guardarEnStorage();
  renderList();
  mostrarMensaje('Almacén de personas limpiado por completo.', 'error');
});

// --- FUNCIONES DE UI Y DATOS ---

function guardarEnStorage() {
  localStorage.setItem('almacen_personas', JSON.stringify(personas));
}

function renderList() {
  personList.innerHTML = '';
  personCount.textContent = `${personas.length} persona${personas.length !== 1 ? 's' : ''}`;

  if (personas.length === 0) {
    personList.innerHTML = '<div class="empty-state">Aún no hay personas almacenadas.</div>';
    return;
  }

  personas.forEach(persona => {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.innerHTML = `
      <div class="item-info">
        <i class="fa-solid fa-user"></i>
        <span><strong>${persona.apellido}, ${persona.nombre}</strong> — DNI: ${persona.documento}</span>
      </div>
      <button class="del btn-del-item" data-id="${persona.id}">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    personList.appendChild(li);
  });

  document.querySelectorAll('.btn-del-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      personas = personas.filter(p => p.id !== id);
      guardarEnStorage();
      renderList();
      mostrarMensaje('Persona eliminada del almacén.', 'error');
    });
  });
}

function mostrarMensaje(texto, tipo) {
  globalMsg.textContent = texto;
  globalMsg.className = `global-msg ${tipo}`;
  
  setTimeout(() => {
    globalMsg.className = 'global-msg hidden';
  }, 3500);
}