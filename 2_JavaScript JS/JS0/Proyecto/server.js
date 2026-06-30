import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.use('/Pages',   express.static(path.join(__dirname, 'Pages')));
app.use('/Scripts', express.static(path.join(__dirname, 'Scripts')));
app.use('/Styles',  express.static(path.join(__dirname, 'Styles')));
app.use('/Modulos', express.static(path.join(__dirname, 'Modulos')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'index.html'));
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'Pages', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`   Servidor corriendo en http://localhost:${PORT}\n`);
});