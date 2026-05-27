import {
  validarTexto,
  validarEmail,
  validarEdad,
  validarTelefono,
  validarDocumento,
  validarSoloTexto,
  validarFechaNacimiento
} from "/Modulos/validaciones.js";


const form = document.getElementById("formPersona");
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");


// Cargamos las personas guardadas, o arrancamos con un array vacío
let personas = JSON.parse(localStorage.getItem("personas")) || [];
let editIndex = null; // null = estamos creando, número = estamos editando


mostrarPersonas();


// Cuando cambia el select de hijos, mostramos u ocultamos el campo de cantidad
document.getElementById("hijos").addEventListener("change", function() {
  const cantidadHijos = document.getElementById("cantidadHijos");
  if (this.value === "Si") {
    cantidadHijos.style.display = "block";
  } else {
    cantidadHijos.style.display = "none";
    cantidadHijos.value = "";
  }
});


// Calcula la edad real a partir de una fecha de nacimiento
// Tiene en cuenta si el cumpleaños ya pasó este año o no
function calcularEdad(fecha) {
  let hoy = new Date();
  let nacimiento = new Date(fecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  let mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}


// Verifica que un select tenga algo seleccionado (no esté en la opción vacía)
function validarSelect(valor) {
  return valor !== "" && valor !== null && valor !== undefined;
}


form.addEventListener("submit", function(e) {
  e.preventDefault();


  let tieneHijos = document.getElementById("hijos").value;


  let persona = {
    nombre: document.getElementById("nombre").value.trim(),
    apellido: document.getElementById("apellido").value.trim(),
    edad: document.getElementById("edad").value,
    fecha: document.getElementById("fecha").value,
    sexo: document.getElementById("sexo").value,
    documento: document.getElementById("documento").value.trim(),
    estadoCivil: document.getElementById("estadoCivil").value.trim(),
    nacionalidad: document.getElementById("nacionalidad").value.trim(),
    telefono: document.getElementById("telefono").value.trim(),
    mail: document.getElementById("mail").value.trim(),
    hijos: tieneHijos,
    // Si no tiene hijos guardamos "0" directamente, sin leer el campo oculto
    cantidadHijos: tieneHijos === "Si" ? document.getElementById("cantidadHijos").value : "0"
  };


  // Revisamos que ningún campo esté vacío, saltando cantidadHijos que se valida aparte
  for (let key in persona) {
    if (key === "cantidadHijos") continue;
    if (persona[key] === "" || persona[key] === null) {
      return mostrarError("Todos los campos son obligatorios");
    }
  }


  if (!validarSoloTexto(persona.nombre))
    return mostrarError("Nombre inválido");


  if (!validarSoloTexto(persona.apellido))
    return mostrarError("Apellido inválido");


  if (!validarEdad(persona.edad))
    return mostrarError("Edad inválida");


  if (!validarFechaNacimiento(persona.fecha))
    return mostrarError("La fecha de nacimiento no puede ser futura");


  // Cruzamos la edad escrita con la que se calcula desde la fecha
  if (Number(persona.edad) !== calcularEdad(persona.fecha))
    return mostrarError("La edad no coincide con la fecha de nacimiento");


  if (!validarSelect(persona.sexo))
    return mostrarError("Sexo obligatorio");


  if (!validarDocumento(persona.documento))
    return mostrarError("Documento inválido");


  if (!validarTexto(persona.estadoCivil))
    return mostrarError("Estado civil obligatorio");


  if (!validarSoloTexto(persona.nacionalidad))
    return mostrarError("Nacionalidad inválida");


  if (!validarTelefono(persona.telefono))
    return mostrarError("Teléfono inválido");


  if (!validarEmail(persona.mail))
    return mostrarError("Mail inválido");


  if (!validarSelect(persona.hijos))
    return mostrarError("Seleccione si tiene hijos");


  if (persona.hijos === "Si" &&
    (persona.cantidadHijos === "" || Number(persona.cantidadHijos) < 1)
  ) {
    return mostrarError("Cantidad de hijos inválida");
  }


  // Si editIndex tiene un número, estamos editando esa posición del array
  if (editIndex === null) {
    personas.push(persona);
    mostrarMensaje("Persona guardada correctamente", "green");
  } else {
    personas[editIndex] = persona;
    editIndex = null;
    mostrarMensaje("Persona actualizada correctamente", "green");
  }


  localStorage.setItem("personas", JSON.stringify(personas));
  form.reset();


  // Después del reset, nos aseguramos de volver a ocultar el campo de cantidad
  document.getElementById("cantidadHijos").style.display = "none";


  mostrarPersonas();
});


function mostrarPersonas() {
  lista.innerHTML = "";
  personas.forEach((p, index) => {
    lista.innerHTML += `
      <li class="card">
        <strong>${p.nombre} ${p.apellido}</strong><br>
        Edad: ${p.edad}<br>
        Fecha: ${p.fecha}<br>
        Documento: ${p.documento}<br>
        Tel: ${p.telefono}<br>
        Mail: ${p.mail}<br>
        <button onclick="editarPersona(${index})">Editar</button>
        <button onclick="eliminarPersona(${index})">Eliminar</button>
      </li>
    `;
  });

  if (personas.length === 0) {
    lista.innerHTML = "<p>No hay personas cargadas todavía.</p>";
  }
}


// Se expone en window porque se llama desde el onclick del HTML generado dinámicamente
window.eliminarPersona = function(index) {
  personas.splice(index, 1);
  localStorage.setItem("personas", JSON.stringify(personas));
  mostrarPersonas();
  mostrarMensaje("Persona eliminada", "red");
}


// Igual que eliminarPersona, necesita estar en window por el onclick dinámico
window.editarPersona = function(index) {
  let p = personas[index];


  document.getElementById("nombre").value = p.nombre;
  document.getElementById("apellido").value = p.apellido;
  document.getElementById("edad").value = p.edad;
  document.getElementById("fecha").value = p.fecha;
  document.getElementById("sexo").value = p.sexo;
  document.getElementById("documento").value = p.documento;
  document.getElementById("estadoCivil").value = p.estadoCivil;
  document.getElementById("nacionalidad").value = p.nacionalidad;
  document.getElementById("telefono").value = p.telefono;
  document.getElementById("mail").value = p.mail;
  document.getElementById("hijos").value = p.hijos;


  // Si tenía hijos, mostramos el campo y cargamos el valor guardado
  const cantidadHijos = document.getElementById("cantidadHijos");
  if (p.hijos === "Si") {
    cantidadHijos.style.display = "block";
    cantidadHijos.value = p.cantidadHijos;
  } else {
    cantidadHijos.style.display = "none";
    cantidadHijos.value = "";
  }


  editIndex = index;
}


function mostrarMensaje(texto, color) {
  mensaje.innerHTML = texto;
  mensaje.style.color = color;
}


function mostrarError(texto) {
  mostrarMensaje(texto, "red");
}