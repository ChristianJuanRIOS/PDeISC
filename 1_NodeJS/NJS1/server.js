import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;


const mimeTypes = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
};


http.createServer((req, res) => {
    let filePath;


    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'Pages', 'ejercicio5.html');
    } else {
        filePath = path.join(__dirname, req.url);
    }


    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';


    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('No encontrado: ' + req.url);
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });

    
}).listen(PORT, () => {
    console.log(`Hola mundo desde Node.JS`);
    console.log(`Fin`);
    console.log(`Servidor corriendo en http://localhost:3000`);
});