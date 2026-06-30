const DARK_CLASS = "dark-mode";
const STORAGE_KEY = "darkMode";


// Aplica o quita el modo oscuro y guarda la preferencia en localStorage
// localStorage persiste aunque se cierre el navegador
function applyDarkMode(enable) {
  // El segundo argumento de classList.toggle fuerza agregar (true) o quitar (false) la clase
  document.body.classList.toggle(DARK_CLASS, enable);
  localStorage.setItem(STORAGE_KEY, enable);
}


function toggleDarkMode() {
  const isDark = document.body.classList.contains(DARK_CLASS);
  applyDarkMode(!isDark);
}


function initDarkMode() {
  const saved = localStorage.getItem(STORAGE_KEY);


  if (saved !== null) {
    // Si el usuario ya eligió antes, se respeta su preferencia guardada
    applyDarkMode(saved === "true"); // localStorage siempre guarda strings, no booleanos
  } else {
    // Si no hay preferencia guardada, se detecta la preferencia del sistema operativo
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyDarkMode(prefersDark);
  }
}


initDarkMode();


document.getElementById("btn-darkmode").addEventListener("click", toggleDarkMode);