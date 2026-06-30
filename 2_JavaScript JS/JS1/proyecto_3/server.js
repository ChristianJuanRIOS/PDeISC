import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Para simular __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Si entra a la raíz, redirige automáticamente al index.html que está en Pages
  let filePath = '.' + (req.url === '/' ? '/Pages/index.html' : req.url);
  let extname = path.extname(filePath);
  let contentType = 'text/html';

  // Asignar el tipo MIME correcto según la extensión
  if (extname === '.js') contentType = 'application/javascript';
  if (extname === '.css') contentType = 'text/css';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error interno del servidor');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});