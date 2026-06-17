export function animarEliminar(li, callback) {
  li.style.transition = "opacity 0.3s ease, transform 0.3s ease, margin 0.3s ease, padding 0.3s ease, max-height 0.3s ease";
  li.style.opacity = "0";
  li.style.transform = "translateX(40px)";
  li.style.maxHeight = li.offsetHeight + "px";
  li.style.overflow = "hidden";


  setTimeout(() => {
    li.style.maxHeight = "0";
    li.style.margin = "0";
    li.style.padding = "0";
  }, 300);


  setTimeout(() => {
    callback();
  }, 600);
}


// animacion.js — agregá esta función


export function animarAgregar(li) {
  li.style.opacity = "0";
  li.style.transform = "translateX(-40px)";
  li.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  // Forzar reflow para que la transición arranque
  li.offsetHeight;

  li.style.opacity = "1";
  li.style.transform = "translateX(0)";
}