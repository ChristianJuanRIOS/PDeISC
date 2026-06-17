const btn = document.getElementById("toggleDark");
const icon = btn.querySelector("i");
const body = document.body;


// Si el usuario ya había activado el modo oscuro antes, lo restauramos al cargar la página
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark");
  icon.className = "fa-solid fa-sun";
}


// Cada vez que se hace click, alternamos la clase "dark" en el body
btn.addEventListener("click", () => {
  body.classList.toggle("dark");


  // Se guarda el estado actual para que se mantenga al cambiar de página o recargar
  let dark = body.classList.contains("dark");
  localStorage.setItem("darkMode", dark);


  // Cambiamos el ícono según el modo actual
  icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
});


// La animación de shake se agrega solo cuando el cursor está encima
btn.addEventListener("mouseenter", () => {
  icon.classList.add("fa-beat");
});


// Al salir el cursor la quitamos
btn.addEventListener("mouseleave", () => {
  icon.classList.remove("fa-beat");
});


// Móvil: cuando el dedo toca el botón
btn.addEventListener("touchstart", () => {
  icon.classList.add("fa-shake");
});

// Móvil: cuando el dedo se levanta, quitamos la animación
btn.addEventListener("touchend", () => {
  icon.classList.remove("fa-shake");
});