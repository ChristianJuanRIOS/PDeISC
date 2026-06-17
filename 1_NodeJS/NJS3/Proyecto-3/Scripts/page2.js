document.getElementById("btn2").addEventListener("click", () => {
  // classList.toggle agrega la clase si no está, o la quita si ya está
  // Esto permite alternar el fondo entre el color original y el azul de .bg-cambiado
  document.body.classList.toggle("bg-cambiado");
});