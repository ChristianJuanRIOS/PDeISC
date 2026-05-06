const btn = document.getElementById("btn-contar");
const mensaje = document.getElementById("mensaje");

btn.addEventListener("click", () => {
  const cantidad = document.body.children.length;

  mensaje.textContent = `El body tiene ${cantidad} hijos`;
  mensaje.className = "info";
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2000);
});