document.addEventListener("DOMContentLoaded", () => {


  const form = document.getElementById("formulario");
  const resultado = document.getElementById("resultado");


  // Referencia al input dinámico de "Otro" hobby (null si no existe)
  let otroInput = null;


  // Muestra u oculta el campo de texto adicional según el radio seleccionado
  document.querySelectorAll('input[name="hobby"]').forEach(radio => {
    radio.addEventListener("change", () => {


      // Elimina el input anterior si ya existía
      if (otroInput) {
        otroInput.remove();
        otroInput = null;
      }


      // Si eligió "Otro", inserta un input de texto antes del botón submit
      if (radio.value === "Otro" && radio.checked) {
        otroInput = document.createElement("input");
        otroInput.type = "text";
        otroInput.name = "hobbyOtro";
        otroInput.placeholder = "Especifica tu pasatiempo";
        otroInput.id = "hobby-otro-input";


        form.insertBefore(otroInput, form.querySelector("button"));
      }
    });
  });


  form.addEventListener("submit", async (e) => {
    e.preventDefault();


    const formData = new FormData(form);
    const hobby = formData.get("hobby");


    // Si el hobby es "Otro", usa el valor del campo adicional; si está vacío, usa un fallback
    let hobbyFinal = hobby;
    if (hobby === "Otro") {
      const otroValor = formData.get("hobbyOtro");
      hobbyFinal = otroValor && otroValor.trim() !== ""
        ? otroValor
        : "Otro (sin especificar)";
    }


    const data = {
      nombre: formData.get("nombre"),
      edad: formData.get("edad"),
      email: formData.get("email"),
      genero: formData.get("genero"),
      pais: formData.get("pais"),
      hobby: hobbyFinal
    };


    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });


      // Si el servidor responde con error HTTP, se corta la ejecución
      if (!res.ok) {
        console.error("Error en el servidor:", res.status);
        return;
      }


      const json = await res.json();


      // Muestra los datos confirmados por el backend en el DOM
      resultado.innerHTML = `
        <div class="card">
          <h3>Datos registrados</h3>
          <p>Nombre: ${json.nombre}</p>
          <p>Edad: ${json.edad}</p>
          <p>Email: ${json.email}</p>
          <p>Género: ${json.genero}</p>
          <p>País: ${json.pais}</p>
          <p>Pasatiempo: ${json.hobby}</p>
        </div>
      `;

      
    } catch (error) {
      // Error de red o fallo en el fetch (no llega al servidor)
      console.error("Error en fetch:", error);
    }
  });


});