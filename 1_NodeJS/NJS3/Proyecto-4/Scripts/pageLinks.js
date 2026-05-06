// Referencias a los botones y zonas de contenido del DOM
const crearBtn = document.getElementById("crear");
const modificarBtn = document.getElementById("modificar");
const contenedor = document.getElementById("contenedor");
const mensaje = document.getElementById("mensaje");


// Indica si los enlaces ya fueron creados; controla el modo del botón crear (crear/borrar)
let creados = false;


// Lista de sitios disponibles para crear y modificar enlaces
const sitios = [
  { nombre: "Google",       url: "https://www.google.com" },
  { nombre: "GitHub",       url: "https://www.github.com" },
  { nombre: "Classroom",    url: "https://classroom.google.com" },
  { nombre: "Jira",         url: "https://www.atlassian.com/software/jira" },
  { nombre: "StackOverflow",url: "https://stackoverflow.com" },
  { nombre: "MDN Docs",     url: "https://developer.mozilla.org" },
  { nombre: "YouTube",      url: "https://www.youtube.com" },
  { nombre: "Reddit",       url: "https://www.reddit.com" },
  { nombre: "LinkedIn",     url: "https://www.linkedin.com" },
  { nombre: "ChatGPT",      url: "https://chat.openai.com" }
];


// Índice del próximo sitio a usar al modificar; avanza cíclicamente por el array
let indiceCambio = 0;


crearBtn.addEventListener("click", () => {
  if (!creados) {
    // Crea los primeros 5 enlaces del array y los agrega al contenedor
    for (let i = 0; i < 5; i++) {
      const link = document.createElement("a");
      link.textContent = sitios[i].nombre;
      link.href = sitios[i].url;
      link.target = "_blank";
      link.classList.add("item");
      contenedor.appendChild(link);
    }


    creados = true;
    crearBtn.textContent = "Borrar enlaces";
    mensaje.textContent = "Se crearon los enlaces.";
    mensaje.className = "info";
    mensaje.style.display = "block";


  } else {
    // Si ya existen, los elimina y resetea el estado del botón
    contenedor.innerHTML = "";
    mensaje.innerHTML = "";
    creados = false;
    crearBtn.textContent = "Crear enlaces";
    mensaje.textContent = "Se eliminaron todos los enlaces.";
    mensaje.className = "exito";
    mensaje.style.display = "block";
  }
});


modificarBtn.addEventListener("click", () => {
  const links = contenedor.querySelectorAll("a");


  // Si no hay enlaces creados, muestra aviso y corta la ejecución
  if (links.length === 0) {
    mensaje.textContent = "No hay enlaces para modificar.";
    mensaje.className = "info";
    mensaje.style.display = "block";
    return;
  }


  mensaje.innerHTML = "";


  links.forEach((link) => {
    const nombreAnterior = link.textContent;


    // Avanza al siguiente sitio en el array de forma cíclica
    indiceCambio = (indiceCambio + 1) % sitios.length;
    const nuevoSitio = sitios[indiceCambio];


    link.href = nuevoSitio.url;
    link.textContent = nuevoSitio.nombre;


    // Registra el cambio en el div de mensajes para que el usuario lo vea
    const p = document.createElement("p");
    p.textContent = `"${nombreAnterior}" ahora dirige a "${nuevoSitio.nombre}"`;
    p.classList.add("item");
    mensaje.appendChild(p);
  });


  mensaje.className = "exito";
  mensaje.style.display = "block";
});