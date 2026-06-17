const btnHome = document.getElementById("btn-home");


// Se verifica que el botón exista antes de agregarle el evento
// porque home.js se carga en todas las páginas, incluyendo index donde no hay btn-home
if (btnHome) {
  btnHome.addEventListener("click", () => {
    // Redirige a la raíz del servidor (index.html)
    window.location.href = "/";
  });
}