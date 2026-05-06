export function procesarFormulario(data) {
  return {
    nombre: data.nombre,
    edad: data.edad,
    email: data.email,
    genero: data.genero,
    pais: data.pais,
    hobby: data.hobby
  };
}