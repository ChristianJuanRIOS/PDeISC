import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

// En ES Modules no existe __dirname por defecto, hay que reconstruirlo así:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = __dirname; // carpeta donde está este server.js (raíz del proyecto)

// Mapeo de extensiones a Content-Type
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2'
};

const server = http.createServer((req, res) => {
  // Quita query strings (ej: ?v=1) y decodifica caracteres especiales de la URL
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // La raíz del sitio muestra el index.html dentro de Pages
  if (urlPath === '/') {
    urlPath = '/Pages/index.html';
  }

  const filePath = path.join(ROOT, urlPath);

  // Evita que se pueda salir de la carpeta del proyecto con "../"
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Acceso prohibido');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 - No se encontró: ${urlPath}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});