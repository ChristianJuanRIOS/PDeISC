import {
    validarTexto,
    validarEmail,
    validarEdad
} from "/Modulos/validaciones.js";


const form = document.getElementById("formUsuario");
const lista = document.getElementById("listaUsuarios");
const mensaje = document.getElementById("mensaje");


// Cargamos los usuarios guardados, o arrancamos con un array vacío
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


// Al cargar la página mostramos lo que ya había guardado
mostrarUsuarios();


form.addEventListener("submit", function(e) {
    e.preventDefault();

    
    // Tres formas distintas de leer valores del formulario
    // 1) La más común: buscar el elemento por su id
    let nombre = document.getElementById("nombre").value;

    
    // 2) Buscar por atributo name con querySelector
    let mail = document.querySelector("input[name='mail']").value;


    // 3) FormData: agarra todos los campos del form de una sola vez
    let datos = new FormData(form);
    let edad = datos.get("edad");


    // Validamos cada campo, si algo falla mostramos el error y cortamos
    if (!validarTexto(nombre)) {
        mensaje.innerHTML = "El nombre es obligatorio";
        mensaje.style.color = "red";
        return;
    }


    if (!validarEmail(mail)) {
        mensaje.innerHTML = "Mail inválido";
        mensaje.style.color = "red";
        return;
    }


    if (!validarEdad(edad)) {
        mensaje.innerHTML = "Edad inválida";
        mensaje.style.color = "red";
        return;
    }


    // Si todo está bien entonces guardamos en el array y en localStorage, y actualizamos la lista
    mensaje.innerHTML = "Usuario guardado correctamente";
    mensaje.style.color = "green";


    usuarios.push({ nombre, mail, edad });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));


    mostrarUsuarios();
    form.reset();
});


// Limpia la lista y la vuelve a armar desde cero con los usuarios actuales
function mostrarUsuarios() {
    lista.innerHTML = "";
    usuarios.forEach((u) => {
        lista.innerHTML += `
            <div class="card">
                <h3>${u.nombre}</h3>
                <p>${u.mail}</p>
                <p>${u.edad} años</p>
            </div>
        `;
    });

    if (usuarios.length === 0) {
        lista.innerHTML = "<p>No hay usuarios cargados todavía.</p>";
    }
}