import { URL } from 'url';

const direccion = "http://localhost:3000/ruta?nombre=Chris&edad=19";

const miUrl = new URL(direccion);

console.log("Host:", miUrl.host);
console.log("Path:", miUrl.pathname);
console.log("Query nombre:", miUrl.searchParams.get("nombre"));
console.log("Query edad:", miUrl.searchParams.get("edad"));