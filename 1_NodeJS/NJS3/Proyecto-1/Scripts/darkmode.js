// ===== DARK MODE =====

const DARK_CLASS = "dark-mode";
const STORAGE_KEY = "darkMode";

/**
 * Aplica o quita el dark mode según el valor booleano recibido.
 * @param {boolean} enable
 */
function applyDarkMode(enable) {
  document.body.classList.toggle(DARK_CLASS, enable);
  localStorage.setItem(STORAGE_KEY, enable);
}

/* Alterna entre dark y light mode */
export function toggleDarkMode() {
  const isDark = document.body.classList.contains(DARK_CLASS);
  applyDarkMode(!isDark);
}


export function initDarkMode() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    applyDarkMode(saved === "true");
  } else {
    // Preferencia del sistema operativo
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyDarkMode(prefersDark);
  }
}