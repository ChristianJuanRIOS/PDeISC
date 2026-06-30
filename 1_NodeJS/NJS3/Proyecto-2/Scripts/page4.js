// Referencia al contenedor donde se agregan, modifican y eliminan elementos
const contenedor = document.getElementById("contenedor");


// Crea un nuevo párrafo y lo agrega al final del contenedor
document.getElementById("btn4").addEventListener("click", () => {
  const nuevo = document.createElement("p");
  nuevo.textContent = "Elemento creado";
  nuevo.classList.add("item");
  contenedor.appendChild(nuevo);
});


document.getElementById("btn-color").addEventListener("click", () => {
  const items = document.querySelectorAll(".item");


  // Solo actúa si existe al menos un elemento; apunta siempre al último del array
  if (items.length > 0) {
    const ultimo = items[items.length - 1];
    ultimo.style.backgroundColor = "#4a90e2";
    ultimo.style.color = "white";
  }
});


document.getElementById("btn-borrar").addEventListener("click", () => {
  const items = document.querySelectorAll(".item");


  // Solo elimina si existe al menos un elemento; elimina siempre el último
  if (items.length > 0) {
    items[items.length - 1].remove();
  }
});