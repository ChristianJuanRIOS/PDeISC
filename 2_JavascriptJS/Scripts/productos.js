import {
    validarTexto,
    validarNumero,
    validarStock,
    validarMarca,
    validarSoloTexto
} from "/Modulos/validaciones.js";


// Tres arrays, cada uno con su método de almacenaje
const productosMemoria = [];
const productosLocal = JSON.parse(localStorage.getItem("productosLocal")) || [];
const productosSession = JSON.parse(sessionStorage.getItem("productosSession")) || [];


const lista = document.getElementById("listaProductos");
const mensaje = document.getElementById("mensaje");


// Al cargar la página mostramos lo que ya había guardado
mostrarProductos();


// Lee los campos del formulario, valida cada uno y retorna el objeto producto o null si hay error
function obtenerProductoValidado() {
    let producto = {
        nombre: document.getElementById("nombre").value,
        marca: document.getElementById("marca").value,
        precio: document.getElementById("precio").value,
        categoria: document.getElementById("categoria").value,
        stock: document.getElementById("stock").value,
        color: document.getElementById("color").value,
        peso: document.getElementById("peso").value,
        codigo: document.getElementById("codigo").value
    };


    if (!validarTexto(producto.nombre)) {
        mensaje.innerHTML = "El nombre es obligatorio";
        mensaje.style.color = "red";
        return null;
    }
    // La marca acepta letras y números (ej: "3M", "7UP")
    if (!validarMarca(producto.marca)) {
        mensaje.innerHTML = "Marca inválida";
        mensaje.style.color = "red";
        return null;
    }
    if (!validarNumero(producto.precio)) {
        mensaje.innerHTML = "Precio inválido";
        mensaje.style.color = "red";
        return null;
    }
    if (!validarTexto(producto.categoria)) {
        mensaje.innerHTML = "La categoría es obligatoria";
        mensaje.style.color = "red";
        return null;
    }
    // El stock puede ser 0, por eso usamos validarStock y no validarNumero
    if (!validarStock(producto.stock)) {
        mensaje.innerHTML = "Stock inválido";
        mensaje.style.color = "red";
        return null;
    }
    if (!validarTexto(producto.color)) {
        mensaje.innerHTML = "El color es obligatorio";
        mensaje.style.color = "red";
        return null;
    }
    // Verificamos que el color no tenga números u otros caracteres
    if (!validarSoloTexto(producto.color)) {
        mensaje.innerHTML = "El color solo puede contener letras";
        mensaje.style.color = "red";
        return null;
    }
    if (!validarTexto(producto.peso)) {
        mensaje.innerHTML = "El peso es obligatorio";
        mensaje.style.color = "red";
        return null;
    }
    if (!validarTexto(producto.codigo)) {
        mensaje.innerHTML = "El código es obligatorio";
        mensaje.style.color = "red";
        return null;
    }
    // El código es numérico puro, no se permiten letras
    if (!validarNumero(producto.codigo)) {
        mensaje.innerHTML = "El código debe ser un número positivo";
        mensaje.style.color = "red";
        return null;
    }


    return producto;
}


document.getElementById("btnMemoria").addEventListener("click", function() {
    const producto = obtenerProductoValidado();
    if (!producto) return;


    producto.storage = "Memoria";
    productosMemoria.push(producto);

    
    mensaje.innerHTML = "Guardado en Memoria — se pierde al recargar";
    mensaje.style.color = "green";
    mostrarProductos();
    document.getElementById("formProducto").reset();
});


document.getElementById("btnLocal").addEventListener("click", function() {
    const producto = obtenerProductoValidado();
    if (!producto) return;


    producto.storage = "localStorage";
    productosLocal.push(producto);
    // Sincronizamos el array con localStorage para que persista al recargar
    localStorage.setItem("productosLocal", JSON.stringify(productosLocal));

    
    mensaje.innerHTML = "Guardado en localStorage — persiste aunque cierres";
    mensaje.style.color = "green";
    mostrarProductos();
    document.getElementById("formProducto").reset();
});


document.getElementById("btnSession").addEventListener("click", function() {
    const producto = obtenerProductoValidado();
    if (!producto) return;


    producto.storage = "sessionStorage";
    productosSession.push(producto);
    // Sincronizamos el array con sessionStorage
    sessionStorage.setItem("productosSession", JSON.stringify(productosSession));


    mensaje.innerHTML = "Guardado en sessionStorage — se borra al cerrar la pestaña";
    mensaje.style.color = "green";
    mostrarProductos();
    document.getElementById("formProducto").reset();
});


// Limpia la lista y la vuelve a armar separando los productos por su origen de almacenaje
function mostrarProductos() {
    lista.innerHTML = "";


    if (productosMemoria.length > 0) {
        lista.innerHTML += `<h2>Memoria(${productosMemoria.length})</h2>`;
        productosMemoria.forEach((p, i) => lista.innerHTML += crearCard(p, i));
    }


    if (productosLocal.length > 0) {
        lista.innerHTML += `<h2>localStorage(${productosLocal.length})</h2>`;
        productosLocal.forEach((p, i) => lista.innerHTML += crearCard(p, i));
    }


    if (productosSession.length > 0) {
        lista.innerHTML += `<h2>sessionStorage(${productosSession.length})</h2>`;
        productosSession.forEach((p, i) => lista.innerHTML += crearCard(p, i));
    }


    if (productosMemoria.length === 0 && productosLocal.length === 0 && productosSession.length === 0) {
        lista.innerHTML = "<p>No hay productos cargados todavía.</p>";
    }
}


function crearCard(p, index) {
    return `
        <div class="card">
            <h3>${p.nombre}</h3>
            <p>Marca: ${p.marca}</p>
            <p>Precio: $${p.precio}</p>
            <p>Categoría: ${p.categoria}</p>
            <p>Stock: ${p.stock}</p>
            <p>Color: ${p.color}</p>
            <p>Peso: ${p.peso}</p>
            <p>Código: ${p.codigo}</p>
            <p><strong>Guardado en: ${p.storage}</strong></p>
            <p><em>Posición: ${index + 1}</em></p>
        </div>
    `;
}