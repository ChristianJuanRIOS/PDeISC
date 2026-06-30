// Valor actual del contador; se incrementa o resetea según el botón presionado
let contador = 0;


const display = document.getElementById("contador");
const btn = document.getElementById("btn5");
const reset = document.getElementById("reset");


btn.addEventListener("click", () => {
  contador++;
  display.textContent = contador;


  // Agrega la clase "cambio" y la quita a los 200ms para disparar una animación CSS
  display.classList.add("cambio");
  setTimeout(() => {
    display.classList.remove("cambio");
  }, 200);
});


reset.addEventListener("click", () => {
  contador = 0;
  display.textContent = contador;


  // Mismo efecto visual que en el incremento
  display.classList.add("cambio");
  setTimeout(() => {
    display.classList.remove("cambio");
  }, 200);
});