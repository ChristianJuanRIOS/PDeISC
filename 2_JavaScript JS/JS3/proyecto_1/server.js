import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


// Servir archivos estáticos
app.use(express.static(__dirname)); // Para servir CSS y Scripts desde la raíz

// Rutas específicas
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/Scripts', express.static(path.join(__dirname, 'Scripts')));

// Agrega esto después de las rutas estáticas
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content
});

// Ruta principal - sirve index.html desde la carpeta pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Archivo no encontrado</h1>
        <p>Buscando: ${req.url}</p>
        <p>Directorio actual: ${__dirname}</p>
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});