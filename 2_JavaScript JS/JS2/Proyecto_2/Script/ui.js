export function mostrarResultados(utiles, noUtiles) {
  const lista = document.getElementById("lista");
  const stats = document.getElementById("stats");
  const listaHeader = document.getElementById("listaHeader");
  const btnGuardar = document.getElementById("btnGuardar");

  
  lista.innerHTML = "";


  utiles.forEach((num, i) => {
    const li = document.createElement("li");
    li.textContent = num;


    // Estado inicial invisible y desplazado para poder animar la entrada
    li.style.opacity = "0";
    li.style.transform = "translateX(-40px)";


    // El delay (i * 0.05s) escalonado hace que cada ítem aparezca uno tras otro
    li.style.transition = `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`;
    lista.appendChild(li);


    // Doble rAF: el primer frame deja que el navegador registre el estado inicial (opacity 0),
    // el segundo aplica el estado final. Sin esto, la transición no ocurre porque el navegador
    // fusiona ambos estados en un solo repintado.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        li.style.opacity = "1";
        li.style.transform = "translateX(0)";
      });
    });
  });


  const total = utiles.length + noUtiles.length;
  // Evita división por cero si ambas listas están vacías
  const porcentaje = total === 0 ? "0%" : ((utiles.length / total) * 100).toFixed(1) + "%";


  document.getElementById("contUtiles").textContent = utiles.length;
  document.getElementById("contNoUtiles").textContent = noUtiles.length;
  document.getElementById("porcentaje").textContent = porcentaje;


  stats.style.display = "flex";
  listaHeader.style.display = "flex";
  btnGuardar.style.display = "block";
}


// tipo tiene valor por defecto "ok" por si se llama sin segundo argumento
export function mostrarMensaje(texto, tipo = "ok") {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.className = tipo; // aplica estilo CSS según sea "ok" o "error"
  // Autolimpieza: borra el mensaje después de 3 segundos
  setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "";
  }, 3000);
}