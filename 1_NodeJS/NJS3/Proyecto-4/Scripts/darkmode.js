// Referencias al botón de tema y su ícono
const btnTema = document.getElementById("btn-tema");
const iconoTema = btnTema.querySelector("i");


// Aplica el tema guardado en localStorage al cargar la página
const temaGuardado = localStorage.getItem("tema");
if (temaGuardado === "oscuro") {
  document.body.classList.add("dark");
  iconoTema.classList.replace("fa-moon", "fa-sun");
}


// Alterna entre modo oscuro y claro al hacer click
btnTema.addEventListener("click", () => {
  const estaOscuro = document.body.classList.toggle("dark");

  if (estaOscuro) {
    iconoTema.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("tema", "oscuro");
  } else {
    iconoTema.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("tema", "claro");
  }
});