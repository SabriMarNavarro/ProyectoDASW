// Importar módulos:
const express = require('express');
const path = require('path');
const router = require(path.join(__dirname, 'App', 'controllers', 'router'));
const cors = require('cors');

const app = express();

// Levantar el servidor en el puerto 3000
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Aplicación de ejemplo corriendo en el puerto ${port}`);
});

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware para usar el router principal
app.use('/', router); // Usa el router que ya tiene las rutas definidas

// Middleware para servir archivos estáticos
app.use(express.static('App'));
app.use('/Views', express.static('Views'));


// imprime el mensaje cuando se corre el servidor
app.listen(port, () => {
  console.log(`Aplicación de ejemplo corriendo en el puerto ${port}`);
});
