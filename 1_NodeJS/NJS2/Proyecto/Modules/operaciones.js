// Módulo de operaciones matemáticas avanzadas
export function multiplicar(a, b) {
    return Number(a) * Number(b);
}


export function dividir(a, b) {

    a = Number(a);
    b = Number(b);


    if (b === 0) {
        return "No es posible dividir por cero";
    }


    return a / b;
}