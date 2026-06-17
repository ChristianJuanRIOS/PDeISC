import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = http.createServer((req, res) => {

    console.log("Ruta:", req.url);

    // =========================
    // 🎨 CSS (Styles folder)
    // =========================
    if (req.url.startsWith('/Styles/')) {
        const cssFile = path.basename(req.url);
        const cssPath = path.join(__dirname, 'Styles', cssFile);

        console.log("Buscando CSS en:", cssPath);

        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end("CSS no encontrado");
            }

            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        });

        return;
    }

    // =========================
    // 📦 JS Modules
    // =========================
    if (req.url.startsWith('/Modules/')) {
        const jsFile = path.basename(req.url);
        const jsPath = path.join(__dirname, 'Modules', jsFile);

        console.log("Buscando Módulo en:", jsPath);

        fs.readFile(jsPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end("Módulo no encontrado");
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });

        return;
    }

    // =========================
    // 📜 JS (Scripts folder)
    // =========================
    if (req.url.startsWith('/scripts/') || req.url.startsWith('/Scripts/')) {
        const jsFile = path.basename(req.url);
        const jsPath = path.join(__dirname, 'scripts', jsFile);

        console.log("Buscando JS en:", jsPath);

        fs.readFile(jsPath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end("JS no encontrado");
            }

            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });

        return;
    }

    // =========================
    // 🔵 API SUMAR
    // =========================
    if (req.url.startsWith('/api/sumar')) {
        const url = new URL(req.url, `http://${req.headers.host}`);

        const a = Number(url.searchParams.get('a'));
        const b = Number(url.searchParams.get('b'));

        const resultado = a + b;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ resultado }));
    }

    // =========================
    // 🟢 PÁGINAS HTML
    // =========================
    let fileName = '';

    switch (req.url) {

        case '/':
            fileName = 'index.html';
            break;

        case '/p1':
            fileName = 'pagina1.html';
            break;

        case '/p2':
            fileName = 'pagina2.html';
            break;

        case '/p3':
            fileName = 'pagina3.html';
            break;

        case '/p4':
            fileName = 'pagina4.html';
            break;

        case '/p5':
            fileName = 'pagina5.html';
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end("Página no encontrada");
    }

    const filePath = path.join(__dirname, 'pages', fileName);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end("Error en el servidor");
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

servidor.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});