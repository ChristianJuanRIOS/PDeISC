import { obtenerHora } from '/Modules/hora.js';

function mostrarHora() {
    const box = document.getElementById('resultado-box');
    const texto = document.getElementById('resultado');
    const btn = document.getElementById('btn-hora');

    const visible = !box.classList.contains('hidden');

    if (visible) {
        box.classList.add('hidden');
        btn.innerHTML = '<i class="fa-solid fa-clock"></i> Mostrar hora';
    } else {
        texto.textContent = obtenerHora();
        box.classList.remove('hidden');
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ocultar hora';
    }

    const iconoActualizado = btn.querySelector('i');
    iconoActualizado.classList.remove('fa-flip');
    void iconoActualizado.offsetWidth;
    iconoActualizado.classList.add('fa-flip');
}

window.mostrarHora = mostrarHora;