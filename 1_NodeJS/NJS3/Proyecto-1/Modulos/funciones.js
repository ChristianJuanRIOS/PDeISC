export { toggleDarkMode, initDarkMode } from "/scripts/darkmode.js";


const IMG_1 = "https://th.bing.com/th/id/OIP.hHklYLoa-hRhsM-5keJPoAHaOL?w=115&h=180&c=7&r=0&o=7&pid=1.7&rm=3";
const IMG_2 = "https://th.bing.com/th/id/OIP.7jUMFVbOCaSDQDaWlnNwgQHaKe?w=128&h=181&c=7&r=0&o=7&pid=1.7&rm=3";


// ESTADOS
let h1Activo = false;
let textoEstado = false;
let colorEstado = false;
let imgActiva = false;


//Agregar / Eliminar H1
export function agregarH1() {
  const titulo = document.getElementById("titulo");
  const btn = document.getElementById("btn-h1");


  if (!h1Activo) {
    titulo.textContent = "Hola DOM";
    btn.textContent = "Eliminar H1";
    h1Activo = true;
  } else {
    titulo.textContent = "";
    btn.textContent = "Agregar H1";
    h1Activo = false;
  }
}


//Cambiar texto (Hola ⇄ Chau)
export function cambiarTexto() {
  const titulo = document.getElementById("titulo");


  if (!titulo.textContent) return;


  if (!textoEstado) {
    titulo.textContent = "Chau DOM";
  } else {
    titulo.textContent = "Hola DOM";
  }


  textoEstado = !textoEstado;
}


//Cambiar color (negro ⇄ azul)
export function cambiarColor() {
  const titulo = document.getElementById("titulo");


  if (!titulo.textContent) return;


  if (!colorEstado) {
    titulo.style.color = "blue";
  } else {
    titulo.style.color = "black";
  }

  colorEstado = !colorEstado;
}


//Agregar imagen ⇄ Quitar imagen
export function agregarImagen() {
  const contenedor = document.getElementById("contenedor-img");
  const btn = document.getElementById("btn-img");


  if (!imgActiva) {
    const link = document.createElement("a");
    link.href = IMG_1;
    link.target = "_blank";


    const img = document.createElement("img");
    img.src = IMG_1;
    img.id = "imagen";
    img.width = 200;


    link.appendChild(img);
    contenedor.appendChild(link);


    btn.textContent = "Quitar imagen";
    imgActiva = true;


  } else {
    const img = document.getElementById("imagen");
    if (img) img.parentElement.remove();


    btn.textContent = "Agregar imagen";
    imgActiva = false;
  }
}


export function cambiarImagen() {
  const img = document.getElementById("imagen");
  if (!img) return;


  const link = img.parentElement;


  if (img.src === IMG_1) {
    img.src = IMG_2;
    link.href = IMG_2;
  } else {
    img.src = IMG_1;
    link.href = IMG_1;
  }
}


//Cambiar tamaño (200 ⇄ 300)
export function cambiarTamano() {
  const img = document.getElementById("imagen");
  if (!img) return;


  img.width = img.width === 200 ? 100 : 200;
}