import fs from "fs";


export function guardarArchivo(nombre, contenido) {
  fs.writeFileSync(nombre, contenido);
}