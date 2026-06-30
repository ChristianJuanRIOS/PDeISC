import { animarEliminar } from "./animacion.js";

export function agregarBotonEliminar(li, numero, numeros) {
  const btn = document.createElement("button");
  btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  btn.classList.add("btn-eliminar");

  btn.addEventListener("click", () => {
    animarEliminar(li, () => {
      const index = numeros.indexOf(numero);
      if (index !== -1) numeros.splice(index, 1);

      li.remove();

      document.getElementById("contador").textContent = numeros.length + " / 20";
    });
  });

  li.appendChild(btn);
}


export function animarAgregar(li) {
  li.style.opacity = "0";
  li.style.transform = "translateX(-40px)";
  li.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      li.style.opacity = "1";
      li.style.transform = "translateX(0)";
    });
  });
}