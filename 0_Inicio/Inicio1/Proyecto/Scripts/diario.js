function mostrarFecha() {
  let fecha = new Date();
  let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("fecha").innerText = fecha.toLocaleDateString("es-ES", opciones);
}

mostrarFecha();

function modoOscuro() {
  document.body.classList.toggle("oscuro");

  const icono = document.getElementById("iconoOscuro");
  const btn = document.getElementById("btnOscuro");

  if (document.body.classList.contains("oscuro")) {
    icono.className = "fa-solid fa-sun";
    btn.style.background = "#e2e8f0";
    btn.style.color = "#1a1a2e";
  } else {
    icono.className = "fa-solid fa-moon";
    btn.style.background = "#1a1a2e";
    btn.style.color = "#f1c40f";
  }
}

function filtrar(categoria) {
  let noticias = document.querySelectorAll(".noticia");

  noticias.forEach(noticia => {
    if (categoria === "todas") {
      noticia.style.display = "block";
    } else {
      let cat = noticia.getAttribute("data-categoria");
      noticia.style.display = (cat === categoria) ? "block" : "none";
    }
  });

  // Actualizar link activo en navbar (si usas .nav-link)
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

  // Cerrar el menú
  const menu = document.getElementById("menu");
  if (menu && menu.classList.contains("show")) {
    menu.classList.remove("show");
  }
}


const visor = document.getElementById("visor");
const visorImg = document.getElementById("visorImg");

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("img-fluid")) {
        visorImg.src = e.target.src;
        visor.classList.add("show");
    }
});

visor.addEventListener("click", () => {
    visor.classList.remove("show");
});


// Cerrar al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    toggleMenu(false);
  });
});