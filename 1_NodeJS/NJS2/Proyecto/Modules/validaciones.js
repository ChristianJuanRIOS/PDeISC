export function esNumero(valor) {
    return !isNaN(valor) && valor.trim() !== '';
}


export function validarDosNumeros(a, b) {
    if (!esNumero(a) || !esNumero(b)) {
        return { valido: false, mensaje: 'Ingresá dos números válidos.' };
    }
    return { valido: true };
}


export function validarTresNumeros(a, b, c) {
    if (!esNumero(a) || !esNumero(b) || !esNumero(c)) {
        return { valido: false, mensaje: 'Ingresá tres números válidos.' };
    }
    return { valido: true };
}