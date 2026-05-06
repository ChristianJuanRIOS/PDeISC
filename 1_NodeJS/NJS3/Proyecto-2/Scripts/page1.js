const mensaje = document.getElementById("mensaje");

document.getElementById("btn1").addEventListener("click", () => {
  mensaje.textContent = "Estás en la página 1";
  mensaje.className = "exito";
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2000);
});