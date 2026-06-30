const mensaje = document.getElementById("mensaje");
const btn = document.getElementById("btn3");


// Variable que actúa como interruptor para saber si el mensaje está visible o no
let visible = false;


btn.addEventListener("click", () => {
  if (!visible) {
    // new Date() crea un objeto con la fecha y hora actuales
    // toLocaleString("es-AR") la formatea en formato argentino: dd/mm/aaaa, hh:mm:ss
    const fecha = new Date();
    mensaje.textContent = `Registro del sistema: ${fecha.toLocaleString("es-AR")}`;
    mensaje.className = "info";
    mensaje.style.display = "block";
    btn.textContent = "Ocultar registro";
    visible = true;
  } else {
    mensaje.style.display = "none";
    btn.textContent = "Mostrar registro";
    visible = false;
  }
});