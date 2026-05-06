// Referencia al contenedor donde se inyectan todos los elementos dinámicos
const contenedor = document.getElementById("contenedor");


// Cada click agrega un párrafo al final del contenedor
document.getElementById("btn-texto").addEventListener("click", () => {
  contenedor.innerHTML += `
    <p class="item">Este es un párrafo agregado dinámicamente</p>
  `;
});


// Cada click agrega una imagen placeholder al contenedor
document.getElementById("btn-img").addEventListener("click", () => {
  contenedor.innerHTML += `
    <img src="https://via.placeholder.com/150" class="item">
  `;
});


// Lista de enlaces que se agregan en orden cíclico
const enlaces = [
  { nombre: "Google",     url: "https://www.google.com" },
  { nombre: "GitHub",     url: "https://github.com" },
  { nombre: "Classroom",  url: "https://classroom.google.com" },
  { nombre: "Wikipedia",  url: "https://www.wikipedia.org" },
  { nombre: "YouTube",    url: "https://www.youtube.com" }
];


// Índice del próximo enlace a insertar; se reinicia al llegar al final del array
let indiceLink = 0;


document.getElementById("btn-link").addEventListener("click", () => {
  contenedor.innerHTML += `
    <a href="${enlaces[indiceLink].url}" target="_blank" class="item">
      ${enlaces[indiceLink].nombre}
    </a>
  `;


  // % enlaces.length hace que vuelva a 0 después del último enlace
  indiceLink = (indiceLink + 1) % enlaces.length;
});


document.getElementById("btn-lista").addEventListener("click", () => {
  contenedor.innerHTML += `
    <div class="item">
      <ul>
        <li>Elemento 1</li>
        <li>Elemento 2</li>
        <li>Elemento 3</li>
      </ul>
    </div>
  `;
});


document.getElementById("btn-card").addEventListener("click", () => {
  contenedor.innerHTML += `
    <div class="item">
      <h3>Tarjeta</h3>
      <p>Contenido dinámico con innerHTML</p>
    </div>
  `;
});


// Vacía el contenedor eliminando todo su contenido HTML
document.getElementById("btn-clear").addEventListener("click", () => {
  contenedor.innerHTML = "";
});