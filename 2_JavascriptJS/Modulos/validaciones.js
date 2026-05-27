//Validar texto
export function validarTexto(texto){

    
    return texto.trim() !== "";


}


//Validar email
export function validarEmail(email){


    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return regex.test(email.trim());


}


//Validar edad
export function validarEdad(edad){

    
    edad = Number(edad);


    return edad >= 1 && edad <= 120;


}


//Validar edad
export function validarTelefono(telefono){


    return telefono.trim().length >= 6;


}


//Validar edad
export function validarDocumento(documento){


    return documento.trim().length >= 7;


}


//Validar solo texto
export function validarSoloTexto(texto){


    let regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


    return regex.test(texto.trim());


}


//Validar fecha de nacimiento
export function validarFechaNacimiento(fecha){

    
    let hoy = new Date();

    
    let nacimiento = new Date(fecha);


    return nacimiento <= hoy;

    
}


//Validar marca
export function validarMarca(marca){


    let regex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;


    return regex.test(marca.trim());
}


//Validar números
export function validarNumero(valor){


    let num = Number(valor);

    
    return !isNaN(num) && num > 0;


}


//Validar stock
export function validarStock(valor){


    return Number.isInteger(Number(valor)) && Number(valor) >= 0;


}