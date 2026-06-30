const mensaje = document.getElementById("mensaje");


document.getElementById("btn1").addEventListener("click", () => {
  mensaje.textContent = "Estás en la página 1";


  // Se asigna la clase "exito" para aplicar el estilo verde definido en CSS
  mensaje.className = "exito";
  mensaje.style.display = "block";


  // setTimeout ejecuta una función una sola vez después del delay indicado (2000ms = 2 segundos)
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2000);
});