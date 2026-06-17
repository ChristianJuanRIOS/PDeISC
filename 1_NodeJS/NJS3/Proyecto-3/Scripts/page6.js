const btn = document.getElementById("btn-contar");
const mensaje = document.getElementById("mensaje");


btn.addEventListener("click", () => {
  // children.length cuenta solo los hijos directos del body (no los anidados)
  // Es distinto a querySelectorAll("*") que cuenta todos los descendientes
  const cantidad = document.body.children.length;


  mensaje.textContent = `El body tiene ${cantidad} hijos`;
  mensaje.className = "info";
  mensaje.style.display = "block";

  
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 2000);
});