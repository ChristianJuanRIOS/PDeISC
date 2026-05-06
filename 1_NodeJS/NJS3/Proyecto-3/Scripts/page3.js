const mensaje = document.getElementById("mensaje");

document.getElementById("btn3").addEventListener("click", () => {
  const fecha = new Date();

  const formato = fecha.toLocaleString("es-AR");

  mensaje.textContent = `Registro del sistema: ${formato}`;
  mensaje.className = "info";
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2500);
});