import { decodificar, validarParentesis } from '../Modulos/decodificador.js';

const EJEMPLO = 'Hoy (.sh 22 sal a) (ed asac ne sominuer son) Marcelo.';

const inputMensaje   = document.getElementById('inputMensaje');
const outputMensaje  = document.getElementById('outputMensaje');
const btnDecodificar = document.getElementById('btnDecodificar');
const btnLimpiar     = document.getElementById('btnLimpiar');
const btnEjemplo     = document.getElementById('btnEjemplo');
const btnCopiar      = document.getElementById('btnCopiar');
const mensajeError   = document.getElementById('mensajeError');
const charCount      = document.getElementById('charCount');
const stepsList      = document.getElementById('stepsList');
const stepsBlock     = document.getElementById('stepsBlock');
const panelOutput    = document.querySelector('.panel--output');

function mostrarError(msg) {
  mensajeError.textContent = msg;
  mensajeError.classList.remove('hidden');
}

function ocultarError() {
  mensajeError.classList.add('hidden');
  mensajeError.textContent = '';
}

function actualizarContador() {
  const len = inputMensaje.value.length;
  charCount.textContent = len;
  charCount.parentElement.classList.toggle('near-limit', len > 420);
}

function limpiarOutput() {
  outputMensaje.innerHTML = '<span class="output-box__placeholder">El resultado aparecerá aquí…</span>';
  outputMensaje.classList.remove('has-result');
  panelOutput.classList.remove('has-result');
  stepsList.innerHTML = '';
  stepsBlock.style.display = 'none';
  btnCopiar.classList.add('hidden');
}

function mostrarResultado(resultado, pasos) {
  outputMensaje.textContent = resultado;
  outputMensaje.classList.add('has-result');
  panelOutput.classList.add('has-result');

  stepsList.innerHTML = '';
  pasos.forEach((paso, i) => {
    const li = document.createElement('li');
    li.className = 'step-item';
    li.style.animationDelay = `${i * 60}ms`;
    li.innerHTML = `
      <span class="step-item__num">${String(i + 1).padStart(2, '0')}</span>
      <span class="step-item__text">
        <strong class="step-item__highlight">${paso.descripcion}:</strong>
        ${paso.detalle}
      </span>
    `;
    stepsList.appendChild(li);
  });

  stepsBlock.style.display = 'block';
  btnCopiar.classList.remove('hidden');
}

function accionDecodificar() {
  ocultarError();
  const texto = inputMensaje.value.trim();

  if (!texto) {
    mostrarError('Ingresá un mensaje cifrado para decodificar.');
    return;
  }

  const validacion = validarParentesis(texto);
  if (!validacion.valido) {
    mostrarError(validacion.error);
    limpiarOutput();
    return;
  }

  const { resultado, pasos } = decodificar(texto);
  mostrarResultado(resultado, pasos);
}

async function accionCopiar() {
  const texto = outputMensaje.textContent;
  try {
    await navigator.clipboard.writeText(texto);
    btnCopiar.textContent = 'Copiado';
    setTimeout(() => { btnCopiar.textContent = 'Copiar resultado'; }, 1800);
  } catch {
    btnCopiar.textContent = 'No se pudo copiar';
  }
}

btnDecodificar.addEventListener('click', accionDecodificar);

btnLimpiar.addEventListener('click', () => {
  inputMensaje.value = '';
  actualizarContador();
  limpiarOutput();
  ocultarError();
});

btnEjemplo.addEventListener('click', () => {
  inputMensaje.value = EJEMPLO;
  actualizarContador();
  limpiarOutput();
  ocultarError();
});

btnCopiar.addEventListener('click', accionCopiar);

inputMensaje.addEventListener('input', () => {
  actualizarContador();
  if (inputMensaje.value.trim() === '') limpiarOutput();
});

inputMensaje.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    accionDecodificar();
  }
});

actualizarContador();