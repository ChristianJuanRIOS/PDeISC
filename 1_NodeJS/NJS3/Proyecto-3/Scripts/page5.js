let contador = 0;


const display = document.getElementById("contador");
const btn = document.getElementById("btn5");
const reset = document.getElementById("reset");


btn.addEventListener("click", () => {
  contador++;
  display.textContent = contador;


  // Se agrega la clase "cambio" para disparar la animación CSS (escala + color)
  // y se quita a los 200ms para que pueda volver a dispararse en el próximo click
  display.classList.add("cambio");
  setTimeout(() => {
    display.classList.remove("cambio");
  }, 200);
});


reset.addEventListener("click", () => {
  contador = 0;
  display.textContent = contador;


  display.classList.add("cambio");
  setTimeout(() => {
    display.classList.remove("cambio");
  }, 200);
});