import { suma, resta, multiplicacion, division } from '/Modulos/calculos.js';

// ── Modo oscuro ──────────────────────────────────────────
const toggleBtn = document.getElementById('toggleBtn');

function setDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    toggleBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('darkMode', isDark);
}

// Restaurar preferencia guardada
setDarkMode(localStorage.getItem('darkMode') === 'true');

toggleBtn.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark-mode'));
});

// ── Tabla de ejercicios ──────────────────────────────────
const secciones = [
    {
        titulo: 'Ejercicio 2',
        operaciones: [
            { label: '4 + 5', resultado: 4 + 5 },
            { label: '3 - 6', resultado: 3 - 6 },
            { label: '2 * 7', resultado: 2 * 7 },
            { label: '20 / 4', resultado: 20 / 4 },
        ]
    },
    {
        titulo: 'Ejercicio 3',
        operaciones: [
            { label: '4 + 5', resultado: suma(4, 5) },
            { label: '3 - 6', resultado: resta(3, 6) },
            { label: '2 * 7', resultado: multiplicacion(2, 7) },
            { label: '20 / 4', resultado: division(20, 4) },
        ]
    },
    {
        titulo: 'Ejercicio 4',
        operaciones: [
            { label: '5 + 3', resultado: suma(5, 3) },
            { label: '8 - 6', resultado: resta(8, 6) },
            { label: '3 * 11', resultado: multiplicacion(3, 11) },
            { label: '30 / 5', resultado: division(30, 5) },
        ]
    },
];

const tabla = document.getElementById('tabla');

secciones.forEach(({ titulo, operaciones }) => {
    const encabezado = document.createElement('tr');
    encabezado.innerHTML = `<td colspan="2" style="background:#555;color:white;font-weight:bold;">${titulo}</td>`;
    tabla.appendChild(encabezado);

    operaciones.forEach(({ label, resultado }) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td>${label}</td><td>${resultado}</td>`;
        tabla.appendChild(fila);
    });
});