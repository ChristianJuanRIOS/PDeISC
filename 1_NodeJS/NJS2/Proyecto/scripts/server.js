import http from "http";
import fs from "fs";


import { sumar } from "../calculo.js";
import { obtenerClima } from "../pages/Modules/clima.js";
import { obtenerHora } from "../pages/Modules/hora.js";
import { multiplicar, dividir } from "../pages/Modules/operaciones.js";
import { promedio, mayor, menor } from "../pages/Modules/estadisticas.js";


const servidor = http.createServer((req, res) => {


    const url = new URL(req.url, `http://${req.headers.host}`);


    if (url.pathname === "/style.css") {
        fs.readFile("./pages/style.css", (err, data) => {

            if (err) {
                res.writeHead(404);
                return res.end("CSS no encontrado");
            }


            res.writeHead(200, { "Content-Type": "text/css" });
            return res.end(data);
        });
        return;
    }


    // API: Suma
    if (url.pathname === "/api/sumar") {
        const a = Number(url.searchParams.get("a"));
        const b = Number(url.searchParams.get("b"));


        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ resultado: sumar(a, b) }));
    }


    // API: Clima
    if (url.pathname === "/api/clima") {
        const ciudad = url.searchParams.get("ciudad");


        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ clima: obtenerClima(ciudad) }));
    }


    // API: Hora
    if (url.pathname === "/api/hora") {


        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ hora: obtenerHora() }));
    }


    // API: Operaciones
    if (url.pathname === "/api/operaciones") {


        const a = Number(url.searchParams.get("a"));
        const b = Number(url.searchParams.get("b"));


        res.writeHead(200, { "Content-Type": "application/json" });


        return res.end(JSON.stringify({
            multiplicar: multiplicar(a, b),
            dividir: dividir(a, b)
        }));
    }


    // API: Estadísticas
    if (url.pathname === "/api/estadisticas") {


        const a = Number(url.searchParams.get("a"));
        const b = Number(url.searchParams.get("b"));
        const c = Number(url.searchParams.get("c"));

        
        res.writeHead(200, { "Content-Type": "application/json" });


        return res.end(JSON.stringify({
            promedio: promedio(a, b, c),
            mayor: mayor(a, b, c),
            menor: menor(a, b, c)
        }));
    }


    // HTML routing
    let file = "./pages/index.html";


    if (url.pathname === "/p1") file = "./pages/pagina1.html";
    if (url.pathname === "/p2") file = "./pages/pagina2.html";
    if (url.pathname === "/p3") file = "./pages/pagina3.html";
    if (url.pathname === "/p4") file = "./pages/pagina4.html";
    if (url.pathname === "/p5") file = "./pages/pagina5.html";


    // HTML read
    fs.readFile(file, (err, data) => {


        if (err) {
            res.writeHead(404);
            return res.end("Página no encontrada");
        }

        
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });

});


// Start server
servidor.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});