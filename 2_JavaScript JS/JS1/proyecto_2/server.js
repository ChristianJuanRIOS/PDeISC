import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname por defecto: hay que reconstruirlo
// a partir de import.meta.url (el equivalente moderno de __filename).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const ROOT = __dirname; // raíz del proyecto (donde está este archivo)

// Mapeo de extensión -> Content-Type
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css':  'text/css; charset=UTF-8',
  '.js':   'text/javascript; charset=UTF-8', // clave para que los <script type="module"> funcionen
  '.json': 'application/json; charset=UTF-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Si piden "/", redirigimos directo a la página principal
  let urlPath = req.url === '/' ? '/Pages/index.html' : decodeURIComponent(req.url);

  // Evita salir de la carpeta del proyecto con "../"
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Acceso prohibido');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 - No se encontró: ' + urlPath);
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
