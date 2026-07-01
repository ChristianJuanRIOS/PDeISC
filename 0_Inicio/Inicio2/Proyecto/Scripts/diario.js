function mostrarFecha() {
    let fecha = new Date();
    let opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("fecha").innerText = fecha.toLocaleDateString("es-ES", opciones);
}

mostrarFecha();

function sincronizarBotonOscuro() {
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

function modoOscuro() {
    document.body.classList.toggle("oscuro");

    const esOscuro = document.body.classList.contains("oscuro");
    localStorage.setItem("tema", esOscuro ? "oscuro" : "claro");

    sincronizarBotonOscuro();
    animarCambioIcono();
}

function animarCambioIcono() {
    const icono = document.getElementById("iconoOscuro");

    icono.classList.remove("icono-cambio");
    void icono.offsetWidth; // fuerza reflow para poder reiniciar la animación
    icono.classList.add("icono-cambio");

    icono.addEventListener("animationend", () => {
        icono.classList.remove("icono-cambio");
    }, { once: true });
}

// El script inline en el <body> ya agregó la clase "oscuro" si correspondía.
// Acá solo sincronizamos el botón, que recién existe en el DOM en este punto.
sincronizarBotonOscuro();

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

    // Actualizar link activo en navbar
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

    // Cerrar el menú hamburguesa automáticamente
    const menu = document.getElementById("menu");
    if (menu.classList.contains("show")) {
        bootstrap.Collapse.getInstance(menu).hide();
    }
}

function inicializarLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const cerrar = document.getElementById("lightboxCerrar");

    function abrirLightbox(img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "";
        lightbox.classList.add("activo");
        document.body.style.overflow = "hidden"; // evita el scroll de fondo
    }

    function cerrarLightbox() {
        lightbox.classList.remove("activo");
        document.body.style.overflow = "";
    }

    // Delegación de eventos: funciona con imágenes que noticias.js
    // inyecte dinámicamente, incluso después de este momento.
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".noticia img");
        if (img) abrirLightbox(img);
    });

    cerrar.addEventListener("click", cerrarLightbox);

    // Cerrar al hacer click fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) cerrarLightbox();
    });

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cerrarLightbox();
    });
}

inicializarLightbox();